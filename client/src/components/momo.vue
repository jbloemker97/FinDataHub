<template>
    <div>
        <header class="header-area">
            <navbar />

            <div id="home" class="header-content-area">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-lg-6 col-md-10">
                            <div class="header-content text-center">
                                <h3 class="header-title">Enter Stock Ticker Below</h3>
                                <p class="text">Retrieve momo stats</p>
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

        <!-- Start Momo Stats -->
        <!-- Stock & Filing Data -->
        <div class="row mt-5 mb-5">
            <!-- Momo Stats -->
            <div class="col-lg-12 col-md-12 col-sm-12 text-center" v-if="this.momoStats">
                <div class="container">
                    <h1 class="h1 heading-one pb-3">Momo Stats</h1>

                    <div class="row pl-3 pr-3">
                        <div class="col-lg-6 col-sm-6">
                            <div class="single-counter counter-color-1 mt-30 d-flex">
                                <div class="counter-shape">
                                    <span class="shape-1"></span>
                                    <span class="shape-2"></span>
                                </div>
                                <div class="counter-content media-body">
                                    <span class="counter-count">
                                        <span class="counter" v-if="this.momoStats">{{ this.momoStats.totalMomoDays }}</span>
                                        <span class="counter" v-else>-</span>
                                    </span>
                                    <p class="text">Total Momentum Days</p>
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
                                        <span class="counter" v-if="this.momoStats">+{{ this.momoStats.avgHighFromOpenPercent }}%</span>
                                        <span class="counter" v-else>-</span>
                                    </span>
                                    <p class="text">Average high from open</p>
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
                                        <span class="counter" v-if="this.momoStats">-{{ round(this.momoStats.avgCloseFromHighPercent) }}%</span>
                                        <span class="counter" v-else>-</span>
                                    </span>
                                    <p class="text">Average close from high <br> <i>(high-close) / high</i></p>
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
                                        <span class="counter" v-if="this.momoStats">-{{ this.momoStats.avgPercentOfMoveGivenBack }}%</span>
                                        <span class="counter" v-else>-</span>
                                    </span>
                                    <p class="text">Average percent of move given back</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-12 mt-5 pt-5">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Date</th>
                                        <th scope="col">Open</th>
                                        <th scope="col">High</th>
                                        <th scope="col">Low</th>
                                        <th scope="col">Close</th>
                                        <th scope="col">Volume</th>
                                        <th scope="col">High From Open</th>
                                        <th scope="col">Close From High</th>
                                        <th scope="col">HOD Timestamp</th>
                                        <th scope="col">Percent Of Move Given Back</th>
                                        <th scope="col">Gap Above 20%</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="bar in this.momoStats.bars" :key="bar.date" class="tr" :style="bar.percentOfMoveGivenBack > 30 ? {'background-color': '#E53227', 'border-color': '#E53227'} : {'background-color': '#478123', 'border-color': '#478123'}">
                                        <td>{{ bar.date }}</td>
                                        <td>{{ bar.open }}</td>
                                        <td>{{ bar.high }}</td>
                                        <td>{{ bar.low }}</td>
                                        <td>{{ bar.close }}</td>
                                        <td>{{ numberWithCommas(bar.volume) }}</td>
                                        <td>{{ bar.highsFromOpenPercent }}%</td>
                                        <td>{{ bar.closeFromHighPercent }}%</td>
                                        <td>{{ bar.timestamps.hod.timestamp }}</td>
                                        <td>{{ bar.percentOfMoveGivenBack }}%</td>
                                        <td>{{ bar.gapAbove20Percent }}</td>
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
                            <tr v-for="filing in this.filings.registration" :key="filing.reportUrl">
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
                            <tr v-for="filing in this.filings.reports" :key="filing.reportUrl">
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
                            <tr v-for="filing in this.filings.events" :key="filing.reportUrl">
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
import { getMomoStats, getFilings } from '../services/data-service';

export default {
    name: 'momo',
    components: {
        navbar
    },
     data () {
        return {
            ticker: '',
            momoStats: null,
            filings: null
        }
    },
    methods: {
            populateData: function (event) {
                event.preventDefault();
                let s = this;

                // // Reset data
                this.gapStats = null;
                this.stock = null;

                // Get Momo Stats
                getMomoStats({ ticker: this.ticker.toUpperCase() })
                    .then(data => s.momoStats = data.data );

                getFilings({ ticker: this.ticker.toUpperCase() })
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

<style scoped>
    .tr {
        color: #fff;
    }
</style>