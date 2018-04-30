import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";
import { Parser as HtmlToReactParser } from "html-to-react";
import PropTypes from "prop-types";

const htmlToReactParser = new HtmlToReactParser();

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      legend: null
    };
  }

  componentDidMount() {
    this.forceUpdate();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.legend && this.refs.chart) {
      console.log(this.refs.chart.chartInstance.generateLegend());
      this.setState({
        legend: true,
        legendHtml: this.refs.chart.chartInstance.generateLegend()
      });
    }
  }

  render() {
    // if (this.refs.chart) {
    //   document.getElementById('chart-legend').innerHTML =
    // }
    return (
      <div>
        <Doughnut
          data={this.props.data}
          options={this.props.options}
          ref="chart"
        />
        <div id="chart-legend">
          {this.state.legend && htmlToReactParser.parse(this.state.legendHtml)}
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
