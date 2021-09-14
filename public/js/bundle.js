/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("/* eslint-disable no-restricted-globals */\n\n/* eslint-disable no-plusplus */\nvar menuToggle = document.querySelector('.toggle');\nvar navigation = document.querySelector('.navigation');\nvar container = document.querySelector('.container');\n\nmenuToggle.onclick = function () {\n  menuToggle.classList.toggle('active');\n  navigation.classList.toggle('active');\n  container.classList.toggle('active');\n};\n\nvar nav = document.querySelector('.navigation');\nvar list = document.querySelectorAll('.list');\nvar currentLocation = location.href;\nvar menuItem = nav.querySelectorAll('a');\n\nfor (var i = 0; i < menuItem.length; i++) {\n  if (menuItem[i].href === currentLocation) {\n    list[i].className = 'list active';\n  }\n}\n\n//# sourceURL=webpack://mvc/./src/index.js?");

/***/ }),

/***/ "./src/loginValidation.js":
/*!********************************!*\
  !*** ./src/loginValidation.js ***!
  \********************************/
/***/ (() => {

eval("\n\n//# sourceURL=webpack://mvc/./src/loginValidation.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/loginValidation.js"]();
/******/ 	
/******/ })()
;