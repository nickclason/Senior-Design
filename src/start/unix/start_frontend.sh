#!/bin/sh
cd frontend
npm ci && node_modules/.bin/ng serve --host 0.0.0.0 --disable-host-check true