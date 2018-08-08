import React from "react";
import Banner from "./loadingbanner.gif";

export default class ImagePlaceHolder extends React.Component {
    render() {

        return <img alt="Loading Site" src={Banner} style={{width: '100%', height: '100%'}}/>
    }
}
