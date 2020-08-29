<template>
    <div>
        <header class="header-area">
            
            <navbar />
                        
            <!-- If logged In -->
            <div id="home" class="header-content-area">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-lg-6 col-md-10">
                            <div class="header-content text-center">
                                <h3 class="header-title">Enter Stock Ticker Below</h3>
                                <p class="text">Retrieve stock and gap stats</p>
                                <div class="header-newslatter">
                                    <form action="" method="post" @submit="populateData">
                                        <input type="text" id="ticker" v-model="ticker" placeholder="Enter Ticker..." maxLength="5">

                                        <div class="header-btn rounded-buttons">
                                            <button class="main-btn rounded-three" id="submit" type="submit">Look Up Data</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div> 
                </div> 
            </div>
        </header>

        <!-- Stock & Filing Data -->
        <div class="row mt-5 mb-5">
            <!-- Gap Stats -->
            <div class="col-lg-12 col-md-12 col-sm-12 text-center" v-if="this.gapStats">
                <div class="container">
                    <h1 class="h1 heading-one pb-3">Gap Stats</h1>

                    <div class="row pl-3 pr-3">
                        <div class="col-lg-6 col-sm-6">
                            <div class="single-counter counter-color-1 mt-30 d-flex">
                                <div class="counter-shape">
                                    <span class="shape-1"></span>
                                    <span class="shape-2"></span>
                                </div>
                                <div class="counter-content media-body">
                                    <span class="counter-count">
                                        <span class="counter" v-if="this.gapStats">{{ this.gapStats.gapsAbove20Percent }}</span>
                                        <span class="counter" v-else>-</span>
                                    </span>
                                    <p class="text">Gaps Above 20%</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6 col-sm-6">
                            <div class="single-counter counter-color-2 mt-30 d-flex">
                                <div class="counter-shape">
                                    <span class="shape-1"></span>
                                    <span class="shape-2"></span>
                                </div>
                                <div class="counter-content media-body">
                                    <span class="counter-count">
                                        <span class="counter" v-if="this.gapStats">{{ this.gapStats.averageGapPercent }}%</span>
                                        <span class="counter" v-else>-</span>
                                    </span>
                                    <p class="text">Average Gap %</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6 col-sm-6">
                            <div class="single-counter counter-color-3 mt-30 d-flex">
                                <div class="counter-shape">
                                    <span class="shape-1"></span>
                                    <span class="shape-2"></span>
                                </div>
                                <div class="counter-content media-body">
                                    <span class="counter-count">
                                        <span class="counter" v-if="this.gapStats">+{{ this.gapStats.averageHighWhenClosedBelowOpen }}%</span>
                                        <span class="counter" v-else>-</span>
                                    </span>
                                    <p class="text">Average High From Open When Closed Below Open</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6 col-sm-6">
                            <div class="single-counter counter-color-4 mt-30 d-flex">
                                <div class="counter-shape">
                                    <span class="shape-1"></span>
                                    <span class="shape-2"></span>
                                </div>
                                <div class="counter-content media-body">
                                    <span class="counter-count">
                                        <span class="counter" v-if="this.gapStats">{{ this.gapStats.closesBelowOpen }} or {{ round((this.gapStats.closesBelowOpen / this.gapStats.gapsAbove20Percent) * 100) }}%</span>
                                        <span class="counter" v-else>-</span>
                                    </span>
                                    <p class="text">Closes Below Open</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6 col-sm-6">
                            <div class="single-counter counter-color-4 mt-30 d-flex">
                                <div class="counter-shape">
                                    <span class="shape-1"></span>
                                    <span class="shape-2"></span>
                                </div>
                                <div class="counter-content media-body">
                                    <span class="counter-count">
                                        <span class="counter" v-if="this.gapStats">-{{ this.gapStats.averageLowWhenClosedBelowOpen }}%</span>
                                        <span class="counter" v-else>-</span>
                                    </span>
                                    <p class="text">Average Low From Open When Closed Below Open</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6 col-sm-6">
                            <div class="single-counter counter-color-4 mt-30 d-flex">
                                <div class="counter-shape">
                                    <span class="shape-1"></span>
                                    <span class="shape-2"></span>
                                </div>
                                <div class="counter-content media-body">
                                    <span class="counter-count">
                                        <span class="counter" v-if="this.gapStats">{{ numberWithCommas(this.gapStats.previousGapDayVolume) }}</span>
                                        <span class="counter" v-else>-</span>
                                    </span>
                                    <p class="text">Previous Gap Day Volume</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-12 mt-5 pt-5">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Date</th>
                                        <th scope="col">Gap Percent</th>
                                        <th scope="col">Open</th>
                                        <th scope="col">High</th>
                                        <th scope="col">Low</th>
                                        <th scope="col">Close</th>
                                        <th scope="col">Volume</th>
                                        <th scope="col">High From Open</th>
                                        <th scope="col">Low From Open</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="bar in this.gapStats.bars" :key="bar.date" :style="bar.c < bar.o ? {'background-color': '#E53227', 'border-color': '#E53227'} : {'background-color': '#478123', 'border-color': '#478123'}" class="tr">
                                        <th>{{ bar.date }}</th>
                                        <td>{{ bar.gapPercent }}%</td>
                                        <td>{{ bar.o }}</td>
                                        <td>{{ bar.h }}</td>
                                        <td>{{ bar.l }}</td>
                                        <td>{{ bar.c }}</td>
                                        <td>{{ numberWithCommas(bar.v) }}</td>
                                        <td v-if="bar.c < bar.o">{{ round((bar.h - bar.o) / bar.o * 100) }}%</td>
                                        <td v-else>-</td>
                                        <td v-if="bar.c < bar.o">{{ round((bar.o - bar.l) / bar.o * 100) }}%</td>
                                        <td v-else>-</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div> <!-- End Row -->

        <div class="container" v-if="this.filings">
            <div class="row">
                <h1 class="h1 text-center w-100 mb-5">SEC Filings</h1>
            
                <div class="col-lg-12 mb-5">
                    <h3 class="h3 text-center w-100">Registration Statements</h3>
                    <table class="table filing-table">
                        <thead>
                            <tr>
                                <th scope="col">Filed Date</th>
                                <th scope="col">Filing</th>
                                <th scope="col">URL</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="filing in this.filings.registration" :key="filing.filedDate">
                                <td>{{ `${new Date(filing.filedDate).getMonth()}/${new Date(filing.filedDate).getDate()}/${new Date(filing.filedDate).getFullYear()}` }}</td>
                                <td>{{ filing.form }}</td>
                                <td><a :href="filing.reportUrl" target="_blank">{{ filing.reportUrl }}</a></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="col-lg-12 mb-5">
                    <h3 class="h3 text-center w-100">Financial Statements</h3>
                    <table class="table filing-table">
                        <thead>
                            <tr>
                                <th scope="col">Filed Date</th>
                                <th scope="col">Filing</th>
                                <th scope="col">URL</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="filing in this.filings.reports" :key="filing.filedDate">
                                <td>{{ `${new Date(filing.filedDate).getMonth()}/${new Date(filing.filedDate).getDate()}/${new Date(filing.filedDate).getFullYear()}` }}</td>
                                <td>{{ filing.form }}</td>
                                <td><a :href="filing.reportUrl" target="_blank">{{ filing.reportUrl }}</a></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="col-lg-12">
                    <h3 class="h3 text-center w-100">8k Statements</h3>
                    <table class="table filing-table">
                        <thead>
                            <tr>
                                <th scope="col">Filed Date</th>
                                <th scope="col">Filing</th>
                                <th scope="col">URL</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="filing in this.filings.events" :key="filing.filedDate">
                                <td>{{ `${new Date(filing.filedDate).getMonth()}/${new Date(filing.filedDate).getDate()}/${new Date(filing.filedDate).getFullYear()}` }}</td>
                                <td>{{ filing.form }}</td>
                                <td><a :href="filing.reportUrl" target="_blank">{{ filing.reportUrl }}</a></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            
        </div>
        
    </div>

</template>

<script>
    import navbar from './navbar';
    import { getGapStats, getStockData, getFilings } from '../services/data-service';
    
    export default {
        name: 'frontPage',
        components: {
            navbar
        },
        data () {
            return {
                ticker: '',
                gapStats: null,
                fundementals: null,
                stock: null,
                filings: null
            }
        },
        methods: {
            populateData: function (event) {
                event.preventDefault();
                let s = this;

                // Reset data
                this.gapStats = null;
                this.stock = null;

                // Get Gap Stats
                getGapStats({ ticker: this.ticker })
                    .then(data => s.gapStats = data.data );

                getStockData({ ticker: this.ticker })
                    .then(data => s.stock = data.data['cp'][0] );

                getFilings({ ticker: this.ticker })
                    .then(data => s.filings = data.data );
            },
            numberWithCommas: function (x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
            round: function (num) {
                return Math.round((num + Number.EPSILON) * 100) / 100
            }
        }

        
    }
</script>

<style scroped>

.tr {
    color: #fff;
}

.media-body {
    flex: 0.75;
}

.fixedHeight {
    min-height: 150px;
}

input {
    text-transform: uppercase;
}

.single-alerts-message {
    position: relative;
    padding: 20px 24px;
    border-radius: 8px;
}

.alerts-default-bg {
    background-color: #0067f4;
}

.single-alerts-message .alerts-message-icon {
    position: absolute;
    top: 20px;
    left: 24px;
}

.single-alerts-message .alerts-message-content {
    padding-left: 50px;
}

.single-alerts-message .alerts-message-content .message-title {
    font-size: 24px;
    font-weight: 600;
    line-height: 30px;
    color: #fff;
}

.single-alerts-message .alerts-message-content .text {
    font-size: 16px;
    line-height: 24px;
    color: #fff;
    margin-top: 8px;
}

#home {
    padding-top: 100px;
}

.filing-table {
    display: block;
    max-height: 300px;
    overflow-y: scroll;
}
</style>