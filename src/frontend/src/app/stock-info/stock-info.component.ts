import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { IStockChartEventArgs, ChartTheme, ITooltipRenderEventArgs, IAxisLabelRenderEventArgs } from '@syncfusion/ej2-angular-charts';
import { DataService } from '../services/data.service';
import { HttpClient } from '@angular/common/http';


@Component({
    selector: 'app-stock-info',
    templateUrl: './stock-info.component.html',
    styleUrls: ['./stock-info.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StockInfoComponent implements OnInit {

    stock: string;
    chartData: any;
    info: any;
    name!: string;
    logo_url!: string;
    sector!: string;
    mkt_cap!: number
    price!: number;
    dayChange!: number;
    yearChange!: number;
    heldPctInsider!: number;
    heldPctInst!: number;
    shortRatio!: number;
    volume!: number;
    avg_volume!: number;
    news!: any;

    public border!: Object;
    public theme!: string;
    public fill!: string;
    public title!: string;
    public titleStyle!: Object;



    public primaryXAxis: Object = {
        valueType: 'DateTime', majorGridLines: { width: 0 }, crosshairTooltip: { enable: true }
    };

    public primaryYAxis: Object = {
        lineStyle: { color: 'transparent' },
        majorTickLines: { color: 'transparent', width: 0 }
    };
    public chartArea: Object = {
        border: {
            width: 0
        }
    };
    public crosshair: Object = {
        enable: true
    };
    public tooltip: object = { enable: true };
    public columnTooltip: boolean = false;
    public tooltipRender(args: ITooltipRenderEventArgs): void {
        if (args.text!.split('<br/>')[4]) {
            let target: number = parseInt(args.text!.split('<br/>')[4].split('<b>')[1].split('</b>')[0], 10);
            let value: string = (target / 100000000).toFixed(1) + 'B';
            args.text = args.text!.replace(args.text!.split('<br/>')[4].split('<b>')[1].split('</b>')[0], value);
        }
    };
    public axisLabelRender(args: IAxisLabelRenderEventArgs): void {
        let text: number = parseInt(args.text, 10);
        if (args.axis.name === 'primaryYAxis') {
            args.text = text / 100000000 + 'B';
        }
    };


    constructor(private dataService: DataService,
        private http: HttpClient,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<StockInfoComponent>) {

        this.stock = data.symbol
    }

    ngOnInit(): void {
        this.theme = 'MaterialDark';

        this.border = {
            color: '#424242',
            width: 0
        }

        this.fill = '#b4256c';

        this.titleStyle = {
            fontFamily: "Trebuchet MS",
            fontWeight: 'regular',
            color: "#FFFFFF",
            size: '16pt'
        };

        this.http.get<any>('http://localhost:5000/data/get_timeseries?ticker=' + this.stock.toUpperCase() + '&period=max').subscribe(
            data => {
                this.chartData = data["data"];
                // console.log(this.chartData);
                this.title = this.stock + ' Historical';
            }
        );

        this.http.get<any>('http://localhost:5000/data/add_to_db?ticker=' + this.stock.toUpperCase()).subscribe();

        setTimeout(() => {
            this.http.get<any>('http://localhost:5000/data/get?symbol=' + this.stock.toUpperCase()).subscribe(
                data => {
                    this.info = data["stats"];
                    this.name = data["name"];
                    this.logo_url = data["logo_url"];
                    this.sector = this.info["summaryProfile"]["sector"];
                    this.mkt_cap = this.info["price"]["marketCap"];
                    this.yearChange = this.info["defaultKeyStatistics"]["52WeekChange"];
                    this.heldPctInsider = this.info["defaultKeyStatistics"]["heldPercentInsiders"]; // An insider is a director, senior officer, or any person or entity of a company that beneficially owns more than 10% of a company's voting share
                    this.heldPctInst = this.info["defaultKeyStatistics"]["heldPercentInstitutions"];
                    this.shortRatio = this.info["defaultKeyStatistics"]["shortRatio"]; // How many days it would take for all shares short to be covered. how bearish wall street is on the stock
                    this.price = this.info["financialData"]["currentPrice"];
                    this.volume = this.info["summaryDetail"]["volume"];
                    this.avg_volume = this.info["summaryDetail"]["averageVolume"];
                    this.dayChange = this.info["price"]["regularMarketChangePercent"]; // i think this is right
                    this.news = data["news"];
                });
        }, 10);


    }

}
