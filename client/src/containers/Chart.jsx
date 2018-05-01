import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";
import PropTypes from "prop-types";

class Chart extends Component {
  componentDidMount() {
    this.forceUpdate();
  }

  render() {
    if (this.chartRef) {
      console.log(this.refs.chartRef.chart_instance.generateLegend());
      console.log(this.refs.chartRef.chartInstance.generateLegend());
    }
    // const chart = document.getElementsByTagName("canvas")[0];
    // if (chart) {
    //   // console.log(chart.chartInstance.generateLegend());
    //   console.log(this.refs.chartRef.chart_instance.generateLegend());
    // }
    return (
      <div>
        <Doughnut
          data={this.props.data}
          options={this.props.options}
          ref="chartRef"
        />
        <div id="chart-legend">
          {this.refs.chartRef &&
            this.refs.chartRef.chartInstance.generateLegend()}
        </div>
      </div>
    );
  }
}

Chart.propTypes = {
  data: PropTypes.object,
  options: PropTypes.object
};

export default Chart;
