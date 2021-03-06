/* See license.txt for terms of usage */

define(function(require, exports, module) {

const React = require("react");

// Firebug.SDK
const { createFactories } = require("reps/rep-utils");
const { Url } = require("reps/core/url");
const { TreeView } = require("reps/tree-view");
const { Reps } = require("reps/repository");

// XHR Spy
const { NetInfoParams } = createFactories(require("./net-info-groups.js"));
const { XhrUtils } = require("../utils/xhr-utils.js");
const { Json } = require("../utils/json.js");

// Constants
const DOM = React.DOM;

/**
 * This template represents the 'Post' panel and is responsible
 * for displaying posted data.
 */
var PostTab = React.createClass({
  displayName: "PostTab",

  getInitialState: function() {
    return {
      data: {}
    };
  },

  isJson: function(content) {
    return Json.isJSON(content.mimeType, content.text);
  },

  parseJson: function(file) {
    var postData = file.request.postData;
    if (!postData) {
      return null;
    }
    var jsonString = new String(postData.text);
    return Json.parseJSONString(jsonString, "http://" + file.request.url);
  },

  render: function() {
    var actions = this.props.actions;
    var file = this.props.data;

    if (file.discardRequestBody) {
      return DOM.span({className: "netInfoBodiesDiscarded"},
        Locale.$STR("xhrSpy.requestBodyDiscarded")
      );
    }

    var postData = file.request.postData;
    if (!postData) {
      actions.requestData("requestPostData");

      // xxxHonza: localization, real spinner
      return (
        DOM.div({}, "Loading...")
      );
    }

    var text = postData.text;

    // URL encoded post data are nicely rendered as a list
    // of parameters.
    if (text && XhrUtils.isURLEncodedRequest(file)) {
      var lines = text.split("\n");
      var params = Url.parseURLEncodedText(lines[lines.length-1]);
      text = NetInfoParams({headers: params});
    }

    // Multipart post data are parsed and nicely rendered
    // using special template.
    if (text && XhrUtils.isMultiPartRequest(file)) {
      // xxxHonza: TODO FIXME
    }

    if (this.isJson(postData)) {
      var json = this.parseJson(file);
      if (json) {
        return TreeView({
          data: json,
          mode: "tiny"
        });
      }
    }

    return (
      DOM.div({className: "postTabBox"},
        DOM.div({className: "panelContent netInfoResponseContent"},
          text
        )
      )
    );
  }
});

// Exports from this module
exports.PostTab = PostTab;
});
