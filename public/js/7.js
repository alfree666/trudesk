(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[7],{

/***/ "./src/public/js/pages/singleTicket.js":
/*!*********************************************!*\
  !*** ./src/public/js/pages/singleTicket.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*\n *       .                             .o8                     oooo\n *    .o8                             \"888                     `888\n *  .o888oo oooo d8b oooo  oooo   .oooo888   .ooooo.   .oooo.o  888  oooo\n *    888   `888\"\"8P `888  `888  d88' `888  d88' `88b d88(  \"8  888 .8P'\n *    888    888      888   888  888   888  888ooo888 `\"Y88b.   888888.\n *    888 .  888      888   888  888   888  888    .o o.  )88b  888 `88b.\n *    \"888\" d888b     `V88V\"V8P' `Y8bod88P\" `Y8bod8P' 8\"\"888P' o888o o888o\n *  ========================================================================\n *  Author:     Chris Brame\n *  Updated:    1/20/19 4:46 PM\n *  Copyright (c) 2014-2019. All rights reserved.\n */\n\n!(__WEBPACK_AMD_DEFINE_ARRAY__ = [\n  __webpack_require__(/*! jquery */ \"./src/public/js/vendor/jquery/jquery.js\"),\n  __webpack_require__(/*! underscore */ \"./src/public/js/vendor/underscore/underscore.js\"),\n  __webpack_require__(/*! modules/socket */ \"./src/public/js/modules/socket.js\"),\n  __webpack_require__(/*! tomarkdown */ \"./src/public/js/vendor/tomarkdown/tomarkdown.js\"),\n  __webpack_require__(/*! modules/helpers */ \"./src/public/js/modules/helpers.js\"),\n  __webpack_require__(/*! jquery_custom */ \"./src/public/js/plugins/jquery.custom.js\")\n], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($, _, socketClient, md, helpers) {\n  var st = {}\n  st.init = function (callback) {\n    $(document).ready(function () {\n      socketClient.chat.updateOnlineBubbles()\n\n      $('.issue-body img:not(.hasLinked)').each(function () {\n        setupImageLink(this)\n      })\n\n      function setupImageLink (el) {\n        var $this = $(el)\n        var src = $this.attr('src')\n        $this.addClass('hasLinked')\n        var a = $('<a>')\n          .addClass('no-ajaxy')\n          .attr('href', src)\n          .attr('target', '_blank')\n        $this.wrap(a)\n      }\n\n      if (typeof callback === 'function') {\n        return callback()\n      }\n    })\n  }\n\n  return st\n}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))\n\n\n//# sourceURL=webpack:///./src/public/js/pages/singleTicket.js?");

/***/ })

}]);