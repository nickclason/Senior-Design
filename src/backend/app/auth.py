from functools import wraps
from flask import abort
from flask_jwt_extended import *

from app import app  # need to import db if we want to make any modifications to the users during auth
from app.models.user import User


class AuthenticationError(Exception):
    """Base Authentication Exception"""
    def __init__(self, msg=None):
        self.msg = msg

    def __str__(self):
        return self.__class__.__name__ + '(' + str(self.msg) + ')'


class InvalidCredentials(AuthenticationError):
    """Invalid username/password"""


class AccessDenied(AuthenticationError):
    """Access is denied"""


class UserNotFound(AuthenticationError):
    """User identity not found"""


def authenticate_user(email, password):
    user = User.query.filter_by(email=email).first()
    if user and user.password == password: # Check hashed passwords... uh todo...
        accessToken = create_access_token(identity=email)
        refreshToken = create_refresh_token(identity=email)

        return accessToken, refreshToken
    else:
        raise InvalidCredentials()


def get_authenticated_user():
    identity = get_jwt_identity()
    user = User.query.filter_by(email=identity).first()
    if user:
        # print('user found: %s' % user.email)    
        return user
    else:
        raise UserNotFound(identity)


def deauthenticate_user():
    """
    Log user out
    in a real app, set a flag in user database requiring login, or
    implement token revocation scheme
    """
    verify_jwt_in_request()
    identity = get_authenticated_user()
    app.logger.debug('logging user "%s" out', identity)


def refresh_authentication():
    """
    Refresh authentication, issue new access token
    """
    user = get_authenticated_user()
    return create_access_token(identity=user['username'])


def auth_required(func):
    """
    View decorator - require valid access token
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        try:
            get_authenticated_user()
            return func(*args, **kwargs)
        except (UserNotFound) as error:
            app.logger.error('authorization failed: %s', error)
            abort(403)
    return wrapper


def auth_refresh_required(func):
    """
    View decorator - require valid refresh token
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        verify_jwt_refresh_token_in_request()
        try:
            get_authenticated_user()
            return func(*args, **kwargs)
        except (UserNotFound) as error:
            app.logger.error('authorization failed: %s', error)
            abort(403)
    return wrapper