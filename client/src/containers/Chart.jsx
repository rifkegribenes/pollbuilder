import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";
import PropTypes from "prop-types";

class Chart extends Component {
  componentDidMount() {
    this.forceUpdate();
  }

  render() {
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
