import { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchPriceLists } from "../actions";
import _ from "lodash";

class PriceListLoader extends Component {
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!_.isEqual(prevProps.fetchingPrice, this.props.fetchingPrice)) {
      this.props.fetchPriceLists(
        !this.props.fetchingPrice.servicesPricelist ||
          !this.props.fetchingPrice.servicesPricelist.id ||
          !!this.props.servicesPricelists[this.props.fetchingPrice.servicesPricelist.id]
          ? null
          : this.props.fetchingPrice.servicesPricelist,
        !this.props.fetchingPrice.itemsPricelist ||
          !this.props.fetchingPrice.itemsPricelist.id ||
          !!this.props.itemsPricelists[this.props.fetchingPrice.itemsPricelist.id]
          ? null
          : this.props.fetchingPrice.itemsPricelist
      );
    }
  }
  render() {
    return null;
  }
}

const mapStateToProps = (state) => ({
  fetchingPrice: state.medical_pricelist.fetchingPrice,
  servicesPricelists: state.medical_pricelist.servicesPricelists,
  itemsPricelists: state.medical_pricelist.itemsPricelists,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ fetchPriceLists }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(PriceListLoader);
