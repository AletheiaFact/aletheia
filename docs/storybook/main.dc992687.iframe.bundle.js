(self.webpackChunkaletheia = self.webpackChunkaletheia || []).push([
    [179],
    {
        "./.storybook/preview.js-generated-config-entry.js": function (
            __unused_webpack_module,
            __unused_webpack___webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            var preview_namespaceObject = {};
            __webpack_require__.r(preview_namespaceObject),
                __webpack_require__.d(preview_namespaceObject, {
                    __namedExportsOrder: function () {
                        return __namedExportsOrder;
                    },
                    decorators: function () {
                        return decorators;
                    },
                    parameters: function () {
                        return parameters;
                    },
                });
            __webpack_require__(
                "./node_modules/core-js/modules/es.object.keys.js"
            ),
                __webpack_require__(
                    "./node_modules/core-js/modules/es.symbol.js"
                ),
                __webpack_require__(
                    "./node_modules/core-js/modules/es.array.filter.js"
                ),
                __webpack_require__(
                    "./node_modules/core-js/modules/es.object.get-own-property-descriptor.js"
                ),
                __webpack_require__(
                    "./node_modules/core-js/modules/web.dom-collections.for-each.js"
                ),
                __webpack_require__(
                    "./node_modules/core-js/modules/es.object.get-own-property-descriptors.js"
                ),
                __webpack_require__(
                    "./node_modules/core-js/modules/es.object.define-properties.js"
                ),
                __webpack_require__(
                    "./node_modules/core-js/modules/es.object.define-property.js"
                );
            var ClientApi = __webpack_require__(
                    "./node_modules/@storybook/client-api/dist/esm/ClientApi.js"
                ),
                react = __webpack_require__("./node_modules/react/index.js"),
                I18nextProvider = __webpack_require__(
                    "./node_modules/react-i18next/dist/es/I18nextProvider.js"
                ),
                i18next = __webpack_require__(
                    "./node_modules/i18next/dist/esm/i18next.js"
                ),
                context = __webpack_require__(
                    "./node_modules/react-i18next/dist/es/context.js"
                );
            i18next.ZP.use(context.Db).init({
                fallbackLng: "pt",
                debug: !0,
                react: { useSuspense: !1 },
            });
            var i18n = i18next.ZP,
                router_context = __webpack_require__(
                    "./node_modules/next/dist/shared/lib/router-context.js"
                ),
                jsx_runtime =
                    (__webpack_require__("./src/styles/colors.ts"),
                    __webpack_require__("./node_modules/react/jsx-runtime.js")),
                parameters =
                    (react.createElement,
                    {
                        actions: { argTypesRegex: "^on[A-Z].*" },
                        controls: {
                            matchers: {
                                color: /(background|color)$/i,
                                date: /Date$/,
                            },
                        },
                        nextRouter: {
                            Provider: router_context.RouterContext.Provider,
                        },
                        backgrounds: {
                            default: "light",
                            values: [
                                { name: "light", value: "rgb(245,245,245)" },
                                { name: "blue", value: "rgb(17, 39, 58)" },
                                { name: "dark", value: "rgb(81, 81, 81)" },
                            ],
                        },
                    }),
                decorators = [
                    function (Story, _ref) {
                        _ref.globals;
                        return (0, jsx_runtime.jsx)(I18nextProvider.a, {
                            i18n: i18n,
                            children: Story(),
                        });
                    },
                ],
                __namedExportsOrder = ["parameters", "decorators"];
            function ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(object);
                    enumerableOnly &&
                        (symbols = symbols.filter(function (sym) {
                            return Object.getOwnPropertyDescriptor(
                                object,
                                sym
                            ).enumerable;
                        })),
                        keys.push.apply(keys, symbols);
                }
                return keys;
            }
            function _defineProperty(obj, key, value) {
                return (
                    key in obj
                        ? Object.defineProperty(obj, key, {
                              value: value,
                              enumerable: !0,
                              configurable: !0,
                              writable: !0,
                          })
                        : (obj[key] = value),
                    obj
                );
            }
            Object.keys(preview_namespaceObject).forEach(function (key) {
                var value = preview_namespaceObject[key];
                switch (key) {
                    case "args":
                        return (0, ClientApi.uc)(value);
                    case "argTypes":
                        return (0, ClientApi.v9)(value);
                    case "decorators":
                        return value.forEach(function (decorator) {
                            return (0, ClientApi.$9)(decorator, !1);
                        });
                    case "loaders":
                        return value.forEach(function (loader) {
                            return (0, ClientApi.HZ)(loader, !1);
                        });
                    case "parameters":
                        return (0, ClientApi.h1)(
                            (function _objectSpread(target) {
                                for (var i = 1; i < arguments.length; i++) {
                                    var source =
                                        null != arguments[i]
                                            ? arguments[i]
                                            : {};
                                    i % 2
                                        ? ownKeys(Object(source), !0).forEach(
                                              function (key) {
                                                  _defineProperty(
                                                      target,
                                                      key,
                                                      source[key]
                                                  );
                                              }
                                          )
                                        : Object.getOwnPropertyDescriptors
                                        ? Object.defineProperties(
                                              target,
                                              Object.getOwnPropertyDescriptors(
                                                  source
                                              )
                                          )
                                        : ownKeys(Object(source)).forEach(
                                              function (key) {
                                                  Object.defineProperty(
                                                      target,
                                                      key,
                                                      Object.getOwnPropertyDescriptor(
                                                          source,
                                                          key
                                                      )
                                                  );
                                              }
                                          );
                                }
                                return target;
                            })({}, value),
                            !1
                        );
                    case "argTypesEnhancers":
                        return value.forEach(function (enhancer) {
                            return (0, ClientApi.My)(enhancer);
                        });
                    case "argsEnhancers":
                        return value.forEach(function (enhancer) {
                            return (0, ClientApi._C)(enhancer);
                        });
                    case "render":
                        return (0, ClientApi.$P)(value);
                    case "globals":
                    case "globalTypes":
                        var v = {};
                        return (v[key] = value), (0, ClientApi.h1)(v, !1);
                    case "__namedExportsOrder":
                    case "decorateStory":
                    case "renderToDOM":
                        return null;
                    default:
                        return console.log(key + " was not supported :( !");
                }
            });
        },
        "./src/stories/components/CTARegistration.stories.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__),
                __webpack_require__.d(__webpack_exports__, {
                    Default: function () {
                        return Default;
                    },
                    __namedExportsOrder: function () {
                        return __namedExportsOrder;
                    },
                    default: function () {
                        return CTARegistration_stories;
                    },
                });
            var react = __webpack_require__("./node_modules/react/index.js"),
                useTranslation =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/es.object.assign.js"
                    ),
                    __webpack_require__(
                        "./node_modules/react-i18next/dist/es/useTranslation.js"
                    )),
                styled_components_browser_esm = __webpack_require__(
                    "./node_modules/styled-components/dist/styled-components.browser.esm.js"
                ),
                mediaQueries = __webpack_require__(
                    "./src/styles/mediaQueries.ts"
                ),
                CTARegistration_style =
                    styled_components_browser_esm.ZP.div.withConfig({
                        displayName:
                            "CTARegistrationstyle__CTARegistrationStyle",
                        componentId: "sc-14qztc7-0",
                    })(
                        [
                            "border-radius:4px;padding:32px;margin-bottom:45px;.CTA-registration-button{margin:0 auto;}@media ",
                            "{margin-bottom:22px;}",
                        ],
                        mediaQueries.o$.xs
                    ),
                colors = __webpack_require__("./src/styles/colors.ts"),
                umami = __webpack_require__("./src/lib/umami.ts"),
                Button = __webpack_require__("./src/components/Button.tsx"),
                jsx_runtime = __webpack_require__(
                    "./node_modules/react/jsx-runtime.js"
                ),
                CTAButton =
                    (react.createElement,
                    function CTAButton(_ref) {
                        var type = _ref.type,
                            t = (0, useTranslation.$)().t;
                        return (0, jsx_runtime.jsx)(Button.Z, {
                            onClick: function onClick() {
                                (0, umami.dJ)(
                                    "cta-registration-button",
                                    "registration"
                                );
                            },
                            type: type,
                            href: "/sign-up",
                            className: "CTA-registration-button",
                            rounded: "true",
                            style: {
                                alignItems: "center",
                                justifyContent: "center",
                                height: "40px",
                                padding: "0 15px",
                                fontWeight: 700,
                            },
                            children: t("CTARegistration:button"),
                        });
                    });
            CTAButton.displayName = "CTAButton";
            var Home_CTAButton = CTAButton;
            try {
                (CTAButton.displayName = "CTAButton"),
                    (CTAButton.__docgenInfo = {
                        description: "",
                        displayName: "CTAButton",
                        props: {
                            type: {
                                defaultValue: null,
                                description: "",
                                name: "type",
                                required: !0,
                                type: { name: "any" },
                            },
                        },
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/Home/CTAButton.tsx#CTAButton"
                        ] = {
                            docgenInfo: CTAButton.__docgenInfo,
                            name: "CTAButton",
                            path: "src/components/Home/CTAButton.tsx#CTAButton",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
            react.createElement;
            function CTARegistration() {
                var t = (0, useTranslation.$)().t;
                return (0, jsx_runtime.jsxs)(CTARegistration_style, {
                    style: {
                        backgroundColor: colors.Z.bluePrimary,
                        textAlign: "center",
                        maxWidth: "100%",
                        display: "grid",
                        justifyContent: "center",
                    },
                    children: [
                        (0, jsx_runtime.jsx)("p", {
                            style: {
                                width: "100%",
                                color: colors.Z.white,
                                fontSize: "22px",
                                lineHeight: "34px",
                                fontWeight: 800,
                                marginBottom: 0,
                            },
                            children: t("CTARegistration:title"),
                        }),
                        (0, jsx_runtime.jsx)("p", {
                            style: {
                                color: "rgba(255, 255, 255, 0.8)",
                                padding: "0 16px 0 16px",
                                fontSize: "16px",
                                fontWeight: 600,
                                lineHeight: "24px",
                                margin: "32px 0 13px 0",
                            },
                            children: t("CTARegistration:body"),
                        }),
                        (0, jsx_runtime.jsx)("p", {
                            style: {
                                color: "rgba(255, 255, 255, 0.8)",
                                padding: "0 16px 0 16px",
                                fontSize: "14px",
                                fontWeight: 600,
                                lineHeight: "22px",
                                marginBottom: "32px",
                            },
                            children: t("CTARegistration:footer"),
                        }),
                        (0, jsx_runtime.jsx)(Home_CTAButton, {
                            type: Button.L.white,
                        }),
                    ],
                });
            }
            CTARegistration.displayName = "CTARegistration";
            var Home_CTARegistration = CTARegistration,
                CTARegistration_stories =
                    (react.createElement,
                    {
                        title: "Components/CTARegistration",
                        component: Home_CTARegistration,
                    }),
                Default = function Default() {
                    return (0, jsx_runtime.jsx)(Home_CTARegistration, {});
                };
            (Default.displayName = "Default"),
                (Default.parameters = Object.assign(
                    {
                        storySource: {
                            source: "() => (\n    <CTARegistration />\n)",
                        },
                    },
                    Default.parameters
                ));
            var __namedExportsOrder = ["Default"];
        },
        "./src/stories/components/baseList/OrderModal.stories.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__),
                __webpack_require__.d(__webpack_exports__, {
                    Asc: function () {
                        return Asc;
                    },
                    Desc: function () {
                        return Desc;
                    },
                    __namedExportsOrder: function () {
                        return __namedExportsOrder;
                    },
                });
            __webpack_require__(
                "./node_modules/core-js/modules/es.object.assign.js"
            );
            var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    "./node_modules/react/index.js"
                ),
                _components_Modal_OrderModal__WEBPACK_IMPORTED_MODULE_2__ =
                    __webpack_require__(
                        "./src/components/Modal/OrderModal.tsx"
                    ),
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ =
                    __webpack_require__("./node_modules/react/jsx-runtime.js");
            react__WEBPACK_IMPORTED_MODULE_0__.createElement;
            __webpack_exports__.default = {
                title: "Components/BaseList/OrderModal",
                component:
                    _components_Modal_OrderModal__WEBPACK_IMPORTED_MODULE_2__.Z,
                args: { visible: !0 },
            };
            var Template = function Template(args) {
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(
                    _components_Modal_OrderModal__WEBPACK_IMPORTED_MODULE_2__.Z,
                    Object.assign({}, args)
                );
            };
            Template.displayName = "Template";
            var Asc = Template.bind({});
            Asc.args = { value: "asc" };
            var Desc = Template.bind({});
            (Desc.args = { value: "desc" }),
                (Asc.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => (\n    <OrderModal {...args} />\n)",
                        },
                    },
                    Asc.parameters
                )),
                (Desc.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => (\n    <OrderModal {...args} />\n)",
                        },
                    },
                    Desc.parameters
                ));
            var __namedExportsOrder = ["Asc", "Desc"];
        },
        "./src/stories/components/baseList/OrderRadio.stories.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__),
                __webpack_require__.d(__webpack_exports__, {
                    Asc: function () {
                        return Asc;
                    },
                    Desc: function () {
                        return Desc;
                    },
                    __namedExportsOrder: function () {
                        return __namedExportsOrder;
                    },
                });
            __webpack_require__(
                "./node_modules/core-js/modules/es.object.assign.js"
            );
            var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    "./node_modules/react/index.js"
                ),
                _components_Radio_OrderRadio__WEBPACK_IMPORTED_MODULE_2__ =
                    __webpack_require__(
                        "./src/components/Radio/OrderRadio.tsx"
                    ),
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ =
                    __webpack_require__("./node_modules/react/jsx-runtime.js");
            react__WEBPACK_IMPORTED_MODULE_0__.createElement;
            __webpack_exports__.default = {
                title: "Components/BaseList/OrderRadio",
                component:
                    _components_Radio_OrderRadio__WEBPACK_IMPORTED_MODULE_2__.Z,
            };
            var Template = function Template(args) {
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(
                    _components_Radio_OrderRadio__WEBPACK_IMPORTED_MODULE_2__.Z,
                    Object.assign({}, args)
                );
            };
            Template.displayName = "Template";
            var Asc = Template.bind({});
            Asc.args = { value: "asc" };
            var Desc = Template.bind({});
            (Desc.args = { value: "desc" }),
                (Asc.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => (\n    <OrderRadio {...args} />\n)",
                        },
                    },
                    Asc.parameters
                )),
                (Desc.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => (\n    <OrderRadio {...args} />\n)",
                        },
                    },
                    Desc.parameters
                ));
            var __namedExportsOrder = ["Asc", "Desc"];
        },
        "./src/stories/components/baseList/SortByButton.stories.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__),
                __webpack_require__.d(__webpack_exports__, {
                    Default: function () {
                        return Default;
                    },
                    __namedExportsOrder: function () {
                        return __namedExportsOrder;
                    },
                    default: function () {
                        return SortByButton_stories;
                    },
                });
            __webpack_require__(
                "./node_modules/core-js/modules/es.object.assign.js"
            );
            var react = __webpack_require__("./node_modules/react/index.js"),
                lib_button =
                    (__webpack_require__(
                        "./node_modules/antd/lib/button/style/index.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/button/index.js"
                    )),
                SortAscendingOutlined = __webpack_require__(
                    "./node_modules/@ant-design/icons/es/icons/SortAscendingOutlined.js"
                ),
                OrderModal = __webpack_require__(
                    "./src/components/Modal/OrderModal.tsx"
                ),
                useTranslation = __webpack_require__(
                    "./node_modules/react-i18next/dist/es/useTranslation.js"
                ),
                colors = __webpack_require__("./src/styles/colors.ts"),
                jsx_runtime = __webpack_require__(
                    "./node_modules/react/jsx-runtime.js"
                ),
                SortByButton =
                    (react.createElement,
                    function SortByButton(_ref) {
                        var refreshListItems = _ref.refreshListItems,
                            t = (0, useTranslation.$)().t,
                            _useState = (0, react.useState)(!1),
                            visible = _useState[0],
                            setVisible = _useState[1],
                            _useState2 = (0, react.useState)("asc"),
                            value = _useState2[0],
                            setValue = _useState2[1];
                        return (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                            children: [
                                (0, jsx_runtime.jsx)(lib_button.default, {
                                    shape: "round",
                                    icon: (0, jsx_runtime.jsx)(
                                        SortAscendingOutlined.Z,
                                        {
                                            style: {
                                                fontSize: "16px",
                                                color: colors.Z.blackSecondary,
                                            },
                                        }
                                    ),
                                    onClick: function onClick() {
                                        return setVisible(!visible);
                                    },
                                    style: {
                                        borderWidth: "2px",
                                        borderColor: colors.Z.blackSecondary,
                                        height: "40px",
                                        paddingLeft: 10,
                                        paddingRight: 10,
                                        marginLeft: 10,
                                    },
                                    children: (0, jsx_runtime.jsx)("span", {
                                        style: {
                                            margin: 0,
                                            fontSize: "14px",
                                            lineHeight: "15px",
                                            fontWeight: 700,
                                            color: colors.Z.blackSecondary,
                                        },
                                        children: t("sortButton:title"),
                                    }),
                                }),
                                (0, jsx_runtime.jsx)(OrderModal.Z, {
                                    visible: visible,
                                    value: value,
                                    setValue: setValue,
                                    handleOk: function handleOk() {
                                        refreshListItems(value),
                                            setVisible(!visible);
                                    },
                                    handleCancel: function handleCancel() {
                                        return setVisible(!1);
                                    },
                                }),
                            ],
                        });
                    }),
                List_SortByButton = SortByButton;
            try {
                (SortByButton.displayName = "SortByButton"),
                    (SortByButton.__docgenInfo = {
                        description: "",
                        displayName: "SortByButton",
                        props: {
                            refreshListItems: {
                                defaultValue: null,
                                description: "",
                                name: "refreshListItems",
                                required: !0,
                                type: { name: "any" },
                            },
                        },
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/List/SortByButton.tsx#SortByButton"
                        ] = {
                            docgenInfo: SortByButton.__docgenInfo,
                            name: "SortByButton",
                            path: "src/components/List/SortByButton.tsx#SortByButton",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
            react.createElement;
            var SortByButton_stories = {
                    title: "Components/BaseList/SortByButton",
                    component: List_SortByButton,
                },
                Default = function Default() {
                    return (0, jsx_runtime.jsx)(List_SortByButton, {
                        refreshListItems: void 0,
                    });
                };
            (Default.displayName = "Default"),
                (Default.parameters = Object.assign(
                    {
                        storySource: {
                            source: "() => (\n    <SortByButton refreshListItems={undefined} />\n)",
                        },
                    },
                    Default.parameters
                ));
            var __namedExportsOrder = ["Default"];
        },
        "./src/stories/components/buttons/AffixButton.stories.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__),
                __webpack_require__.d(__webpack_exports__, {
                    Default: function () {
                        return Default;
                    },
                    __namedExportsOrder: function () {
                        return __namedExportsOrder;
                    },
                    default: function () {
                        return AffixButton_stories;
                    },
                });
            var react = __webpack_require__("./node_modules/react/index.js"),
                slicedToArray =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/es.object.assign.js"
                    ),
                    __webpack_require__(
                        "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js"
                    )),
                UserAddOutlined =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/es.array.map.js"
                    ),
                    __webpack_require__(
                        "./node_modules/@ant-design/icons/es/icons/UserAddOutlined.js"
                    )),
                FileAddFilled = __webpack_require__(
                    "./node_modules/@ant-design/icons/es/icons/FileAddFilled.js"
                ),
                PlusOutlined = __webpack_require__(
                    "./node_modules/@ant-design/icons/es/icons/PlusOutlined.js"
                ),
                PlusCircleFilled = __webpack_require__(
                    "./node_modules/@ant-design/icons/es/icons/PlusCircleFilled.js"
                ),
                esm = __webpack_require__("./node_modules/jotai/esm/index.mjs"),
                js_cookie = __webpack_require__(
                    "./node_modules/js-cookie/dist/js.cookie.mjs"
                ),
                useTranslation = __webpack_require__(
                    "./node_modules/react-i18next/dist/es/useTranslation.js"
                ),
                Trans = __webpack_require__(
                    "./node_modules/react-i18next/dist/es/Trans.js"
                ),
                currentUser = __webpack_require__("./src/atoms/currentUser.ts"),
                colors = __webpack_require__("./src/styles/colors.ts"),
                Button = __webpack_require__("./src/components/Button.tsx"),
                AletheiaModal_style = __webpack_require__(
                    "./src/components/Modal/AletheiaModal.style.tsx"
                ),
                styled_components_browser_esm = __webpack_require__(
                    "./node_modules/styled-components/dist/styled-components.browser.esm.js"
                ),
                jsx_runtime = __webpack_require__(
                    "./node_modules/react/jsx-runtime.js"
                ),
                PulseAnimation =
                    (react.createElement,
                    function PulseAnimation(_ref) {
                        var pulse = _ref.pulse,
                            startColor = _ref.startColor,
                            endColor = _ref.endColor,
                            startSize = _ref.startSize,
                            endSize = _ref.endSize,
                            children = _ref.children,
                            style = _ref.style,
                            AnimatedDiv =
                                styled_components_browser_esm.ZP.div.withConfig(
                                    {
                                        displayName:
                                            "PulseAnimation__AnimatedDiv",
                                        componentId: "sc-rfmwa6-0",
                                    }
                                )(
                                    [
                                        "animation-name:pulse;animation-duration:2s;animation-timing-function:ease-in-out;animation-direction:alternate;animation-iteration-count:",
                                        ";animation-play-state:running;@keyframes pulse{0%{box-shadow:0px 0px 0px ",
                                        "px ",
                                        ";}100%{box-shadow:0px 0px 0px ",
                                        "px ",
                                        ";}}",
                                    ],
                                    pulse ? "infinite" : 0,
                                    startSize,
                                    startColor,
                                    endSize,
                                    endColor
                                );
                        return (0, jsx_runtime.jsx)(AnimatedDiv, {
                            style: style,
                            children: children,
                        });
                    });
            PulseAnimation.displayName = "PulseAnimation";
            var components_PulseAnimation = PulseAnimation;
            try {
                (PulseAnimation.displayName = "PulseAnimation"),
                    (PulseAnimation.__docgenInfo = {
                        description: "",
                        displayName: "PulseAnimation",
                        props: {
                            pulse: {
                                defaultValue: null,
                                description: "",
                                name: "pulse",
                                required: !0,
                                type: { name: "boolean" },
                            },
                            startColor: {
                                defaultValue: null,
                                description: "",
                                name: "startColor",
                                required: !0,
                                type: { name: "string" },
                            },
                            endColor: {
                                defaultValue: null,
                                description: "",
                                name: "endColor",
                                required: !0,
                                type: { name: "string" },
                            },
                            startSize: {
                                defaultValue: null,
                                description: "",
                                name: "startSize",
                                required: !0,
                                type: { name: "number" },
                            },
                            endSize: {
                                defaultValue: null,
                                description: "",
                                name: "endSize",
                                required: !0,
                                type: { name: "number" },
                            },
                            style: {
                                defaultValue: null,
                                description: "",
                                name: "style",
                                required: !1,
                                type: { name: "CSSProperties" },
                            },
                        },
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/PulseAnimation.tsx#PulseAnimation"
                        ] = {
                            docgenInfo: PulseAnimation.__docgenInfo,
                            name: "PulseAnimation",
                            path: "src/components/PulseAnimation.tsx#PulseAnimation",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
            __webpack_require__(
                "./node_modules/antd/lib/tooltip/style/index.js"
            );
            var tooltip = __webpack_require__(
                    "./node_modules/antd/lib/tooltip/index.js"
                ),
                lib_button =
                    (__webpack_require__(
                        "./node_modules/antd/lib/button/style/index.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/button/index.js"
                    )),
                objectWithoutProperties = __webpack_require__(
                    "./node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js"
                ),
                _excluded = ["tooltipText", "style", "icon", "size"],
                Fab =
                    (react.createElement,
                    function Fab(_ref) {
                        var tooltipText = _ref.tooltipText,
                            style = _ref.style,
                            icon = _ref.icon,
                            size = _ref.size,
                            rest = (0, objectWithoutProperties.Z)(
                                _ref,
                                _excluded
                            );
                        return (0, jsx_runtime.jsx)(tooltip.default, {
                            placement: "left",
                            title: tooltipText,
                            children: (0, jsx_runtime.jsx)(
                                lib_button.default,
                                Object.assign(
                                    {
                                        style: Object.assign(
                                            {
                                                background: colors.Z.white,
                                                color: colors.Z.bluePrimary,
                                                boxShadow:
                                                    "rgba(0, 0, 0, 0.35) 0px 8px 24px",
                                                display: "grid",
                                                placeContent: "center",
                                                width: size,
                                                height: size,
                                            },
                                            style
                                        ),
                                        shape: "circle",
                                        type: "link",
                                        icon: icon,
                                    },
                                    rest
                                )
                            ),
                        });
                    });
            Fab.displayName = "Fab";
            var AffixButton_Fab = Fab;
            try {
                (Fab.displayName = "Fab"),
                    (Fab.__docgenInfo = {
                        description: "",
                        displayName: "Fab",
                        props: {
                            tooltipText: {
                                defaultValue: null,
                                description: "",
                                name: "tooltipText",
                                required: !0,
                                type: { name: "string" },
                            },
                            icon: {
                                defaultValue: null,
                                description: "",
                                name: "icon",
                                required: !0,
                                type: { name: "ReactNode" },
                            },
                            size: {
                                defaultValue: null,
                                description: "",
                                name: "size",
                                required: !0,
                                type: { name: "string | number" },
                            },
                            onClick: {
                                defaultValue: null,
                                description: "",
                                name: "onClick",
                                required: !1,
                                type: {
                                    name: "MouseEventHandler<HTMLElement>",
                                },
                            },
                            href: {
                                defaultValue: null,
                                description: "",
                                name: "href",
                                required: !1,
                                type: { name: "string" },
                            },
                            target: {
                                defaultValue: null,
                                description: "",
                                name: "target",
                                required: !1,
                                type: {
                                    name: "string & HTMLAttributeAnchorTarget",
                                },
                            },
                            htmlType: {
                                defaultValue: null,
                                description: "",
                                name: "htmlType",
                                required: !1,
                                type: {
                                    name: "enum",
                                    value: [
                                        { value: '"button"' },
                                        { value: '"submit"' },
                                        { value: '"reset"' },
                                    ],
                                },
                            },
                        },
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/AffixButton/Fab.tsx#Fab"
                        ] = {
                            docgenInfo: Fab.__docgenInfo,
                            name: "Fab",
                            path: "src/components/AffixButton/Fab.tsx#Fab",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
            react.createElement;
            var AffixButton = function AffixButton(_ref) {
                    var personalitySlug = _ref.personalitySlug,
                        _useAtom = (0, esm.KO)(currentUser.Pc),
                        isLoggedIn = (0, slicedToArray.Z)(_useAtom, 1)[0],
                        _useAtom3 = (0, esm.KO)(currentUser.gJ),
                        userRole = (0, slicedToArray.Z)(_useAtom3, 1)[0],
                        _useState = (0, react.useState)(!1),
                        isModalVisible = _useState[0],
                        setIsModalVisible = _useState[1],
                        _useState2 = (0, react.useState)(!1),
                        isOptionsVisible = _useState2[0],
                        setIsOptionsVisible = _useState2[1],
                        t = (0, useTranslation.$)().t,
                        actions = [
                            {
                                icon: (0, jsx_runtime.jsx)(
                                    UserAddOutlined.Z,
                                    {}
                                ),
                                tooltip: t(
                                    "affix:affixButtonCreatePersonality"
                                ),
                                href: "/personality/search",
                                dataCy: "testFloatButtonAddPersonality",
                            },
                        ];
                    "regular" !== userRole &&
                        actions.push({
                            icon: (0, jsx_runtime.jsx)(FileAddFilled.Z, {}),
                            tooltip: t("affix:affixButtonCreateClaim"),
                            href:
                                "/claim/create" +
                                (personalitySlug
                                    ? "?personality=" + personalitySlug
                                    : ""),
                            dataCy: "testFloatButtonAddClaim",
                        }),
                        (0, react.useEffect)(function () {
                            var tutorialShown =
                                js_cookie.Z.get("tutorial_shown") || !1;
                            setIsModalVisible(!tutorialShown);
                        }, []);
                    var handleHideModal = function handleHideModal() {
                        js_cookie.Z.set("tutorial_shown", "true"),
                            setIsModalVisible(!1);
                    };
                    return isLoggedIn
                        ? (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                              children: [
                                  (0, jsx_runtime.jsxs)("div", {
                                      style: {
                                          position: "fixed",
                                          bottom: "3%",
                                          right: "2%",
                                          display: "flex",
                                          flexDirection: "column-reverse",
                                          alignItems: "center",
                                          gap: "1rem",
                                          zIndex: 9999,
                                      },
                                      children: [
                                          (0, jsx_runtime.jsx)(
                                              components_PulseAnimation,
                                              {
                                                  pulse: isModalVisible,
                                                  startColor:
                                                      colors.Z.blueSecondary,
                                                  endColor:
                                                      colors.Z.bluePrimary,
                                                  startSize: 0,
                                                  endSize: 65,
                                                  style: {
                                                      width: "70px",
                                                      height: "70px",
                                                      borderRadius: "100%",
                                                  },
                                                  children: (0,
                                                  jsx_runtime.jsx)(
                                                      AffixButton_Fab,
                                                      {
                                                          tooltipText: t(
                                                              "regular" !==
                                                                  userRole
                                                                  ? "affix:affixButtonTitle"
                                                                  : "affix:affixButtonCreatePersonality"
                                                          ),
                                                          size: "70px",
                                                          onClick:
                                                              function handleClick() {
                                                                  isModalVisible &&
                                                                      handleHideModal(),
                                                                      (function toggleFloatingdrawer() {
                                                                          setIsOptionsVisible(
                                                                              function (
                                                                                  value
                                                                              ) {
                                                                                  return !value;
                                                                              }
                                                                          );
                                                                      })();
                                                              },
                                                          "data-cy":
                                                              "testFloatButton",
                                                          icon: (0,
                                                          jsx_runtime.jsx)(
                                                              PlusOutlined.Z,
                                                              {
                                                                  style: {
                                                                      fontSize:
                                                                          "27px",
                                                                  },
                                                              }
                                                          ),
                                                      }
                                                  ),
                                              }
                                          ),
                                          isOptionsVisible &&
                                              actions.map(function (action) {
                                                  return (0,
                                                  jsx_runtime.jsx)(AffixButton_Fab, { tooltipText: action.tooltip, icon: action.icon, href: action.href, size: "50px", "data-cy": action.dataCy }, action.href);
                                              }),
                                      ],
                                  }),
                                  (0, jsx_runtime.jsxs)(
                                      AletheiaModal_style.Rt,
                                      {
                                          className: "ant-modal-content",
                                          visible: isModalVisible,
                                          footer: !1,
                                          onCancel: handleHideModal,
                                          centered: !0,
                                          title: t("tutorial:modalTitle"),
                                          children: [
                                              (0, jsx_runtime.jsx)("p", {
                                                  style: {
                                                      fontWeight: 600,
                                                      width: "100%",
                                                      textAlign: "center",
                                                      color: colors.Z
                                                          .blackSecondary,
                                                  },
                                                  children: (0,
                                                  jsx_runtime.jsx)(Trans.c, {
                                                      i18nKey:
                                                          "tutorial:modalContent",
                                                      components: [
                                                          (0, jsx_runtime.jsx)(
                                                              PlusCircleFilled.Z,
                                                              {},
                                                              "icon"
                                                          ),
                                                      ],
                                                  }),
                                              }),
                                              (0, jsx_runtime.jsx)("div", {
                                                  style: {
                                                      marginTop: 24,
                                                      width: "100%",
                                                      display: "flex",
                                                      justifyContent: "center",
                                                  },
                                                  children: (0,
                                                  jsx_runtime.jsx)(Button.Z, {
                                                      type: Button.L.blue,
                                                      onClick: handleHideModal,
                                                      "data-cy":
                                                          "testButtonTutorialOk",
                                                      children:
                                                          t(
                                                              "tutorial:okButton"
                                                          ),
                                                  }),
                                              }),
                                          ],
                                      }
                                  ),
                              ],
                          })
                        : null;
                },
                AffixButton_AffixButton = AffixButton;
            try {
                (AffixButton.displayName = "AffixButton"),
                    (AffixButton.__docgenInfo = {
                        description:
                            "* Floating action button that displays the Create Personality option",
                        displayName: "AffixButton",
                        props: {
                            personalitySlug: {
                                defaultValue: null,
                                description: "",
                                name: "personalitySlug",
                                required: !1,
                                type: { name: "string" },
                            },
                        },
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/AffixButton/AffixButton.tsx#AffixButton"
                        ] = {
                            docgenInfo: AffixButton.__docgenInfo,
                            name: "AffixButton",
                            path: "src/components/AffixButton/AffixButton.tsx#AffixButton",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
            react.createElement;
            var AffixButton_stories = {
                    title: "Components/Buttons/AffixButton",
                    component: AffixButton_AffixButton,
                    onClick: { action: "clicked" },
                    decorators: [
                        function (Story) {
                            return (0, jsx_runtime.jsx)("div", {
                                style: { width: "500px" },
                                children: (0, jsx_runtime.jsx)(Story, {}),
                            });
                        },
                    ],
                },
                Template = function Template(args) {
                    return (0, jsx_runtime.jsx)(
                        AffixButton_AffixButton,
                        Object.assign({}, args)
                    );
                };
            Template.displayName = "Template";
            var Default = Template.bind({});
            (Default.args = {
                tooltipTitle: "Click me",
                href: "http://localhost:6006/?path=/story/components-buttons-affixbutton--default",
            }),
                (Default.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => (\n    <AffixButton {...args} />\n)",
                        },
                    },
                    Default.parameters
                ));
            var __namedExportsOrder = ["Default"];
        },
        "./src/stories/components/buttons/AletheiaButton.stories.tsx":
            function (
                __unused_webpack_module,
                __webpack_exports__,
                __webpack_require__
            ) {
                "use strict";
                __webpack_require__.r(__webpack_exports__),
                    __webpack_require__.d(__webpack_exports__, {
                        Blue: function () {
                            return Blue;
                        },
                        Default: function () {
                            return Default;
                        },
                        White: function () {
                            return White;
                        },
                        WhiteBlack: function () {
                            return WhiteBlack;
                        },
                        WhiteBlue: function () {
                            return WhiteBlue;
                        },
                        __namedExportsOrder: function () {
                            return __namedExportsOrder;
                        },
                    });
                var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                        "./node_modules/react/index.js"
                    ),
                    _components_Button__WEBPACK_IMPORTED_MODULE_3__ =
                        (__webpack_require__(
                            "./node_modules/core-js/modules/es.object.values.js"
                        ),
                        __webpack_require__(
                            "./node_modules/core-js/modules/es.object.assign.js"
                        ),
                        __webpack_require__("./src/components/Button.tsx")),
                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ =
                        __webpack_require__(
                            "./node_modules/react/jsx-runtime.js"
                        );
                react__WEBPACK_IMPORTED_MODULE_0__.createElement;
                __webpack_exports__.default = {
                    title: "Components/Buttons/AletheiaButton",
                    component:
                        _components_Button__WEBPACK_IMPORTED_MODULE_3__.Z,
                    argTypes: {
                        onClick: { action: "clicked" },
                        type: {
                            options: Object.values(
                                _components_Button__WEBPACK_IMPORTED_MODULE_3__.L
                            ),
                            mapping:
                                _components_Button__WEBPACK_IMPORTED_MODULE_3__.L,
                            control: { type: "select" },
                        },
                    },
                };
                var Template = function Template(args) {
                    return (0,
                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(
                        _components_Button__WEBPACK_IMPORTED_MODULE_3__.Z,
                        Object.assign({}, args, { children: args.children })
                    );
                };
                Template.displayName = "Template";
                var Default = Template.bind({});
                Default.args = { children: "Default Button type is blue" };
                var Blue = Template.bind({});
                Blue.args = {
                    children: "Blue Button",
                    type: _components_Button__WEBPACK_IMPORTED_MODULE_3__.L
                        .blue,
                };
                var White = Template.bind({});
                (White.args = {
                    type: _components_Button__WEBPACK_IMPORTED_MODULE_3__.L
                        .white,
                    children: "White Button",
                }),
                    (White.parameters = { backgrounds: { default: "blue" } });
                var WhiteBlack = Template.bind({});
                WhiteBlack.args = {
                    type: _components_Button__WEBPACK_IMPORTED_MODULE_3__.L
                        .whiteBlack,
                    children: "white Black Button",
                };
                var WhiteBlue = Template.bind({});
                (WhiteBlue.args = {
                    type: _components_Button__WEBPACK_IMPORTED_MODULE_3__.L
                        .whiteBlue,
                    children: "white Blue Button",
                }),
                    (Default.parameters = Object.assign(
                        {
                            storySource: {
                                source: "(args) => (\n    <AletheiaButton {...args}>{args.children}</AletheiaButton>\n)",
                            },
                        },
                        Default.parameters
                    )),
                    (Blue.parameters = Object.assign(
                        {
                            storySource: {
                                source: "(args) => (\n    <AletheiaButton {...args}>{args.children}</AletheiaButton>\n)",
                            },
                        },
                        Blue.parameters
                    )),
                    (White.parameters = Object.assign(
                        {
                            storySource: {
                                source: "(args) => (\n    <AletheiaButton {...args}>{args.children}</AletheiaButton>\n)",
                            },
                        },
                        White.parameters
                    )),
                    (WhiteBlack.parameters = Object.assign(
                        {
                            storySource: {
                                source: "(args) => (\n    <AletheiaButton {...args}>{args.children}</AletheiaButton>\n)",
                            },
                        },
                        WhiteBlack.parameters
                    )),
                    (WhiteBlue.parameters = Object.assign(
                        {
                            storySource: {
                                source: "(args) => (\n    <AletheiaButton {...args}>{args.children}</AletheiaButton>\n)",
                            },
                        },
                        WhiteBlue.parameters
                    ));
                var __namedExportsOrder = [
                    "Default",
                    "Blue",
                    "White",
                    "WhiteBlack",
                    "WhiteBlue",
                ];
            },
        "./src/stories/components/buttons/BackButton.stories.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__),
                __webpack_require__.d(__webpack_exports__, {
                    Default: function () {
                        return Default;
                    },
                    Underlined: function () {
                        return Underlined;
                    },
                    __namedExportsOrder: function () {
                        return __namedExportsOrder;
                    },
                    default: function () {
                        return BackButton_stories;
                    },
                });
            var react = __webpack_require__("./node_modules/react/index.js"),
                useTranslation =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/es.object.assign.js"
                    ),
                    __webpack_require__(
                        "./node_modules/react-i18next/dist/es/useTranslation.js"
                    )),
                ArrowLeftOutlined = __webpack_require__(
                    "./node_modules/@ant-design/icons/es/icons/ArrowLeftOutlined.js"
                ),
                next_router = __webpack_require__(
                    "./node_modules/next/router.js"
                ),
                colors = __webpack_require__("./src/styles/colors.ts"),
                jsx_runtime = __webpack_require__(
                    "./node_modules/react/jsx-runtime.js"
                );
            react.createElement;
            function BackButton(_ref) {
                var style = _ref.style,
                    callback = _ref.callback,
                    t = (0, useTranslation.$)().t,
                    router = (0, next_router.useRouter)(),
                    pathname = router.pathname || "";
                return "/" !== pathname && "/home-page" !== pathname
                    ? (0, jsx_runtime.jsxs)("a", {
                          style: Object.assign(
                              {
                                  fontWeight: "bold",
                                  color: colors.Z.blueSecondary,
                              },
                              style
                          ),
                          "data-cy": "testBackButton",
                          onClick: function onClick() {
                              callback ? callback() : router.back();
                          },
                          children: [
                              (0, jsx_runtime.jsx)(ArrowLeftOutlined.Z, {}),
                              " ",
                              t("common:back_button"),
                          ],
                      })
                    : (0, jsx_runtime.jsx)(jsx_runtime.Fragment, {});
            }
            var components_BackButton = BackButton;
            try {
                (BackButton.displayName = "BackButton"),
                    (BackButton.__docgenInfo = {
                        description: "",
                        displayName: "BackButton",
                        props: {
                            style: {
                                defaultValue: null,
                                description: "",
                                name: "style",
                                required: !1,
                                type: { name: "CSSProperties" },
                            },
                            callback: {
                                defaultValue: null,
                                description: "",
                                name: "callback",
                                required: !1,
                                type: { name: "() => void" },
                            },
                        },
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/BackButton.tsx#BackButton"
                        ] = {
                            docgenInfo: BackButton.__docgenInfo,
                            name: "BackButton",
                            path: "src/components/BackButton.tsx#BackButton",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
            react.createElement;
            var BackButton_stories = {
                    title: "Components/Buttons/BackButton",
                    component: components_BackButton,
                    parameters: {
                        nextRouter: {
                            path: "/personality",
                            asPath: "/personality",
                            pathname: "/personality",
                        },
                    },
                },
                Template = function Template(args) {
                    return (0, jsx_runtime.jsx)(
                        components_BackButton,
                        Object.assign({}, args)
                    );
                };
            Template.displayName = "Template";
            var Default = Template.bind({});
            Default.args = {};
            var Underlined = Template.bind({});
            (Underlined.args = {
                style: { color: "#fff", textDecoration: "underline" },
            }),
                (Underlined.parameters = { backgrounds: { default: "blue" } }),
                (Default.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => <BackButton {...args} />",
                        },
                    },
                    Default.parameters
                )),
                (Underlined.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => <BackButton {...args} />",
                        },
                    },
                    Underlined.parameters
                ));
            var __namedExportsOrder = ["Default", "Underlined"];
        },
        "./src/stories/components/buttons/SocialMediaShare.stories.tsx":
            function (
                __unused_webpack_module,
                __webpack_exports__,
                __webpack_require__
            ) {
                "use strict";
                __webpack_require__.r(__webpack_exports__),
                    __webpack_require__.d(__webpack_exports__, {
                        Default: function () {
                            return Default;
                        },
                        __namedExportsOrder: function () {
                            return __namedExportsOrder;
                        },
                        default: function () {
                            return SocialMediaShare_stories;
                        },
                    });
                __webpack_require__(
                    "./node_modules/core-js/modules/es.object.assign.js"
                );
                var react = __webpack_require__(
                        "./node_modules/react/index.js"
                    ),
                    slicedToArray = __webpack_require__(
                        "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js"
                    ),
                    typography =
                        (__webpack_require__(
                            "./node_modules/antd/lib/typography/style/index.js"
                        ),
                        __webpack_require__(
                            "./node_modules/antd/lib/typography/index.js"
                        )),
                    FacebookShareButton =
                        (__webpack_require__(
                            "./node_modules/core-js/modules/es.string.replace.js"
                        ),
                        __webpack_require__(
                            "./node_modules/core-js/modules/es.regexp.exec.js"
                        ),
                        __webpack_require__(
                            "./node_modules/core-js/modules/es.string.split.js"
                        ),
                        __webpack_require__(
                            "./node_modules/react-share/es/FacebookShareButton.js"
                        )),
                    FacebookIcon = __webpack_require__(
                        "./node_modules/react-share/es/FacebookIcon.js"
                    ),
                    TwitterShareButton = __webpack_require__(
                        "./node_modules/react-share/es/TwitterShareButton.js"
                    ),
                    TwitterIcon = __webpack_require__(
                        "./node_modules/react-share/es/TwitterIcon.js"
                    ),
                    WhatsappShareButton = __webpack_require__(
                        "./node_modules/react-share/es/WhatsappShareButton.js"
                    ),
                    WhatsappIcon = __webpack_require__(
                        "./node_modules/react-share/es/WhatsappIcon.js"
                    ),
                    TelegramShareButton = __webpack_require__(
                        "./node_modules/react-share/es/TelegramShareButton.js"
                    ),
                    TelegramIcon = __webpack_require__(
                        "./node_modules/react-share/es/TelegramIcon.js"
                    ),
                    useTranslation = __webpack_require__(
                        "./node_modules/react-i18next/dist/es/useTranslation.js"
                    ),
                    colors = __webpack_require__("./src/styles/colors.ts"),
                    styled_components_browser_esm = __webpack_require__(
                        "./node_modules/styled-components/dist/styled-components.browser.esm.js"
                    ),
                    mediaQueries = __webpack_require__(
                        "./src/styles/mediaQueries.ts"
                    ),
                    SocialMediaShare_style =
                        styled_components_browser_esm.ZP.div.withConfig({
                            displayName:
                                "SocialMediaSharestyle__SocialMediaShareStyle",
                            componentId: "sc-11xiot2-0",
                        })(
                            [
                                "margin-bottom:32px;display:flex;border-radius:0;.social-media-container{margin-left:32px;height:39px;}.social-media-list{justify-content:center;}&.logged-out{display:grid;border-radius:10px;grid-template-columns:1fr;.social-media-container{width:276px;margin:0 auto;margin-top:16px;}@media ",
                                "{display:flex;align-items:center;justify-content:center;.social-media-container{width:auto;margin:0;margin-left:32px;}}}@media ",
                                "{margin-bottom:16px;border-radius:0;display:grid;grid-template-columns:1fr;.social-media-container{margin:0 auto;margin-top:16px;}}",
                            ],
                            mediaQueries.o$.md,
                            mediaQueries.o$.xs
                        ),
                    umami = __webpack_require__("./src/lib/umami.ts"),
                    esm = __webpack_require__(
                        "./node_modules/jotai/esm/index.mjs"
                    ),
                    currentUser = __webpack_require__(
                        "./src/atoms/currentUser.ts"
                    ),
                    jsx_runtime = __webpack_require__(
                        "./node_modules/react/jsx-runtime.js"
                    ),
                    Title = (react.createElement, typography.Z.Title),
                    SocialMediaShare = function SocialMediaShare(_ref) {
                        var claimCamelize,
                            _ref$quote = _ref.quote,
                            quote = void 0 === _ref$quote ? null : _ref$quote,
                            _ref$href = _ref.href,
                            href = void 0 === _ref$href ? "" : _ref$href,
                            _ref$claim = _ref.claim,
                            claim = void 0 === _ref$claim ? null : _ref$claim,
                            t = (0, useTranslation.$)().t,
                            _useAtom = (0, esm.KO)(currentUser.Pc),
                            isLoggedIn = (0, slicedToArray.Z)(_useAtom, 1)[0],
                            trimPersonality = (quote =
                                quote || t("share:quote")).replace(" ", "");
                        return (
                            null !== claim &&
                                (claimCamelize = claim
                                    .split(",")
                                    .join("")
                                    .split(".")
                                    .join("")),
                            (0, jsx_runtime.jsxs)(SocialMediaShare_style, {
                                className: !isLoggedIn && "logged-out",
                                style: {
                                    background: colors.Z.lightGray,
                                    padding: "20px 8px",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: "20px",
                                },
                                children: [
                                    (0, jsx_runtime.jsx)(Title, {
                                        level: 3,
                                        style: {
                                            width: "auto",
                                            textAlign: "center",
                                            marginBottom: 0,
                                            fontSize: "26px",
                                            lineHeight: "39px",
                                            fontWeight: 400,
                                            color: colors.Z.blackSecondary,
                                        },
                                        children: t("share:title"),
                                    }),
                                    (0, jsx_runtime.jsx)("nav", {
                                        className: "social-media-container",
                                        children: (0, jsx_runtime.jsxs)("ul", {
                                            className: "social-media-list",
                                            style: {
                                                marginBottom: 0,
                                                padding: 0,
                                                textAlign: "center",
                                                display: "grid",
                                                gridTemplateColumns:
                                                    "30px 30px 30px 30px",
                                                gridColumnGap: "16px",
                                                listStyleType: "none",
                                            },
                                            children: [
                                                (0, jsx_runtime.jsx)("li", {
                                                    children: (0,
                                                    jsx_runtime.jsx)(
                                                        FacebookShareButton.Z,
                                                        {
                                                            url: href,
                                                            quote:
                                                                "Veja o discurso de " +
                                                                quote +
                                                                " na AletheiaFact.org",
                                                            hashtag:
                                                                trimPersonality,
                                                            beforeOnClick:
                                                                function beforeOnClick() {
                                                                    (0,
                                                                    umami.dJ)(
                                                                        "Facebook-share-button",
                                                                        "Sharing"
                                                                    );
                                                                },
                                                            children: (0,
                                                            jsx_runtime.jsx)(
                                                                FacebookIcon.Z,
                                                                {
                                                                    size: 33,
                                                                    round: !0,
                                                                    bgStyle: {
                                                                        fill: colors
                                                                            .Z
                                                                            .bluePrimary,
                                                                    },
                                                                }
                                                            ),
                                                        }
                                                    ),
                                                }),
                                                (0, jsx_runtime.jsx)("li", {
                                                    children: (0,
                                                    jsx_runtime.jsx)(
                                                        TwitterShareButton.Z,
                                                        {
                                                            url:
                                                                "\n\n" +
                                                                href +
                                                                "\n\n",
                                                            title:
                                                                "Veja o discurso de " +
                                                                quote +
                                                                " na AletheiaFact.org",
                                                            hashtags: [
                                                                "aletheia",
                                                                trimPersonality,
                                                                (null !== claim
                                                                    ? (function camelize(
                                                                          str
                                                                      ) {
                                                                          return str
                                                                              .replace(
                                                                                  /(?:^\w|[A-Z]|\b\w)/g,
                                                                                  function (
                                                                                      word,
                                                                                      index
                                                                                  ) {
                                                                                      return 0 ===
                                                                                          index
                                                                                          ? word.toLowerCase()
                                                                                          : word.toUpperCase();
                                                                                  }
                                                                              )
                                                                              .replace(
                                                                                  /\s+/g,
                                                                                  ""
                                                                              );
                                                                      })(
                                                                          claimCamelize
                                                                      )
                                                                    : "") +
                                                                    "\n",
                                                            ],
                                                            beforeOnClick:
                                                                function beforeOnClick() {
                                                                    (0,
                                                                    umami.dJ)(
                                                                        "Twitter-share-button",
                                                                        "Sharing"
                                                                    );
                                                                },
                                                            children: (0,
                                                            jsx_runtime.jsx)(
                                                                TwitterIcon.Z,
                                                                {
                                                                    size: 33,
                                                                    round: !0,
                                                                    bgStyle: {
                                                                        fill: colors
                                                                            .Z
                                                                            .bluePrimary,
                                                                    },
                                                                }
                                                            ),
                                                        }
                                                    ),
                                                }),
                                                (0, jsx_runtime.jsx)("li", {
                                                    children: (0,
                                                    jsx_runtime.jsx)(
                                                        WhatsappShareButton.Z,
                                                        {
                                                            url: href,
                                                            title:
                                                                "Veja o discurso de " +
                                                                quote +
                                                                " na AletheiaFact.org",
                                                            beforeOnClick:
                                                                function beforeOnClick() {
                                                                    (0,
                                                                    umami.dJ)(
                                                                        "Whatsapp-share-button",
                                                                        "Sharing"
                                                                    );
                                                                },
                                                            children: (0,
                                                            jsx_runtime.jsx)(
                                                                WhatsappIcon.Z,
                                                                {
                                                                    size: 33,
                                                                    round: !0,
                                                                    bgStyle: {
                                                                        fill: colors
                                                                            .Z
                                                                            .bluePrimary,
                                                                    },
                                                                }
                                                            ),
                                                        }
                                                    ),
                                                }),
                                                (0, jsx_runtime.jsx)("li", {
                                                    children: (0,
                                                    jsx_runtime.jsx)(
                                                        TelegramShareButton.Z,
                                                        {
                                                            url: href,
                                                            title:
                                                                "Veja o discurso de " +
                                                                quote +
                                                                " na AletheiaFact.org",
                                                            beforeOnClick:
                                                                function beforeOnClick() {
                                                                    (0,
                                                                    umami.dJ)(
                                                                        "Telegram-share-button",
                                                                        "Sharing"
                                                                    );
                                                                },
                                                            children: (0,
                                                            jsx_runtime.jsx)(
                                                                TelegramIcon.Z,
                                                                {
                                                                    size: 33,
                                                                    round: !0,
                                                                    bgStyle: {
                                                                        fill: colors
                                                                            .Z
                                                                            .bluePrimary,
                                                                    },
                                                                }
                                                            ),
                                                        }
                                                    ),
                                                }),
                                            ],
                                        }),
                                    }),
                                ],
                            })
                        );
                    };
                SocialMediaShare.displayName = "SocialMediaShare";
                var components_SocialMediaShare = SocialMediaShare;
                try {
                    (SocialMediaShare.displayName = "SocialMediaShare"),
                        (SocialMediaShare.__docgenInfo = {
                            description: "",
                            displayName: "SocialMediaShare",
                            props: {
                                quote: {
                                    defaultValue: { value: "null" },
                                    description: "",
                                    name: "quote",
                                    required: !1,
                                    type: { name: "any" },
                                },
                                href: {
                                    defaultValue: { value: "" },
                                    description: "",
                                    name: "href",
                                    required: !1,
                                    type: { name: "string" },
                                },
                                claim: {
                                    defaultValue: { value: "null" },
                                    description: "",
                                    name: "claim",
                                    required: !1,
                                    type: { name: "any" },
                                },
                            },
                        }),
                        "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                            (STORYBOOK_REACT_CLASSES[
                                "src/components/SocialMediaShare.tsx#SocialMediaShare"
                            ] = {
                                docgenInfo: SocialMediaShare.__docgenInfo,
                                name: "SocialMediaShare",
                                path: "src/components/SocialMediaShare.tsx#SocialMediaShare",
                            });
                } catch (__react_docgen_typescript_loader_error) {}
                react.createElement;
                var SocialMediaShare_stories = {
                        title: "Components/Buttons/SocialMediaShare",
                        component: components_SocialMediaShare,
                    },
                    Default = function Default() {
                        return (0, jsx_runtime.jsx)(
                            components_SocialMediaShare,
                            {}
                        );
                    };
                (Default.displayName = "Default"),
                    (Default.parameters = Object.assign(
                        {
                            storySource: {
                                source: "() => (\n    <SocialMediaShare />\n)",
                            },
                        },
                        Default.parameters
                    ));
                var __namedExportsOrder = ["Default"];
            },
        "./src/stories/components/buttons/ToggleSection.stories.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__),
                __webpack_require__.d(__webpack_exports__, {
                    SetToFalse: function () {
                        return SetToFalse;
                    },
                    SetToTrue: function () {
                        return SetToTrue;
                    },
                    __namedExportsOrder: function () {
                        return __namedExportsOrder;
                    },
                    default: function () {
                        return ToggleSection_stories;
                    },
                });
            var react = __webpack_require__("./node_modules/react/index.js"),
                lib_radio =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/es.object.assign.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/radio/style/index.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/radio/index.js"
                    )),
                styled_components_browser_esm = __webpack_require__(
                    "./node_modules/styled-components/dist/styled-components.browser.esm.js"
                ),
                colors = __webpack_require__("./src/styles/colors.ts"),
                jsx_runtime = __webpack_require__(
                    "./node_modules/react/jsx-runtime.js"
                ),
                RadioGroup =
                    (react.createElement,
                    (0, styled_components_browser_esm.ZP)(
                        lib_radio.ZP.Group
                    ).withConfig({
                        displayName: "ToggleSection__RadioGroup",
                        componentId: "sc-10lu1b8-0",
                    })(
                        [
                            ".ant-radio-button-wrapper{&.ant-radio-button-wrapper-checked{background:",
                            ";border-color:",
                            ";color:",
                            ';&:not([class*=" ant-radio-button-wrapper-disabled"]){&.ant-radio-button-wrapper:first-child{border-right-color:',
                            ";}}&:not(.ant-radio-button-wrapper-disabled)::before{background:",
                            ";}}}",
                        ],
                        colors.Z.bluePrimary,
                        colors.Z.bluePrimary,
                        colors.Z.white,
                        colors.Z.bluePrimary,
                        colors.Z.bluePrimary
                    )),
                RadioButton = (0, styled_components_browser_esm.ZP)(
                    lib_radio.ZP.Button
                ).withConfig({
                    displayName: "ToggleSection__RadioButton",
                    componentId: "sc-10lu1b8-1",
                })(
                    ["background:", ";color:", ";"],
                    colors.Z.grayTertiary,
                    colors.Z.bluePrimary
                ),
                ToggleSection = function ToggleSection(props) {
                    return (0, jsx_runtime.jsxs)(RadioGroup, {
                        defaultValue: props.defaultValue,
                        buttonStyle: "solid",
                        onChange: props.onChange,
                        children: [
                            (0, jsx_runtime.jsx)(RadioButton, {
                                className: "radio-button",
                                value: !0,
                                style: { borderRadius: "30px 0px 0px 30px" },
                                children: props.labelTrue,
                            }),
                            (0, jsx_runtime.jsx)(RadioButton, {
                                value: !1,
                                style: { borderRadius: "0px 30px 30px 0px" },
                                children: props.labelFalse,
                            }),
                        ],
                    });
                };
            ToggleSection.displayName = "ToggleSection";
            var components_ToggleSection = ToggleSection;
            try {
                (ToggleSection.displayName = "ToggleSection"),
                    (ToggleSection.__docgenInfo = {
                        description: "",
                        displayName: "ToggleSection",
                        props: {
                            defaultValue: {
                                defaultValue: null,
                                description: "",
                                name: "defaultValue",
                                required: !0,
                                type: { name: "boolean" },
                            },
                            onChange: {
                                defaultValue: null,
                                description: "",
                                name: "onChange",
                                required: !0,
                                type: { name: "(event: any) => void" },
                            },
                            labelTrue: {
                                defaultValue: null,
                                description: "",
                                name: "labelTrue",
                                required: !0,
                                type: { name: "string" },
                            },
                            labelFalse: {
                                defaultValue: null,
                                description: "",
                                name: "labelFalse",
                                required: !0,
                                type: { name: "string" },
                            },
                        },
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/ToggleSection.tsx#ToggleSection"
                        ] = {
                            docgenInfo: ToggleSection.__docgenInfo,
                            name: "ToggleSection",
                            path: "src/components/ToggleSection.tsx#ToggleSection",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
            react.createElement;
            var ToggleSection_stories = {
                    title: "Components/Buttons/ToggleSection",
                    component: components_ToggleSection,
                    decorators: [
                        function (Story) {
                            return (0, jsx_runtime.jsx)("div", {
                                style: { width: "500px" },
                                children: (0, jsx_runtime.jsx)(Story, {}),
                            });
                        },
                    ],
                    args: {
                        labelTrue: "Label true",
                        labelFalse: "Label false",
                    },
                },
                SetToTrue = function SetToTrue(args) {
                    return (0, jsx_runtime.jsx)(
                        components_ToggleSection,
                        Object.assign({}, args, { defaultValue: !0 })
                    );
                };
            SetToTrue.displayName = "SetToTrue";
            var SetToFalse = function SetToFalse(args) {
                return (0, jsx_runtime.jsx)(
                    components_ToggleSection,
                    Object.assign({}, args, { defaultValue: !1 })
                );
            };
            (SetToFalse.displayName = "SetToFalse"),
                (SetToTrue.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => (<ToggleSection {...args} defaultValue={true} />)",
                        },
                    },
                    SetToTrue.parameters
                )),
                (SetToFalse.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => (<ToggleSection {...args} defaultValue={false} />)",
                        },
                    },
                    SetToFalse.parameters
                ));
            var __namedExportsOrder = ["SetToTrue", "SetToFalse"];
            try {
                (SetToTrue.displayName = "SetToTrue"),
                    (SetToTrue.__docgenInfo = {
                        description: "",
                        displayName: "SetToTrue",
                        props: {},
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/stories/components/buttons/ToggleSection.stories.tsx#SetToTrue"
                        ] = {
                            docgenInfo: SetToTrue.__docgenInfo,
                            name: "SetToTrue",
                            path: "src/stories/components/buttons/ToggleSection.stories.tsx#SetToTrue",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
            try {
                (SetToFalse.displayName = "SetToFalse"),
                    (SetToFalse.__docgenInfo = {
                        description: "",
                        displayName: "SetToFalse",
                        props: {},
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/stories/components/buttons/ToggleSection.stories.tsx#SetToFalse"
                        ] = {
                            docgenInfo: SetToFalse.__docgenInfo,
                            name: "SetToFalse",
                            path: "src/stories/components/buttons/ToggleSection.stories.tsx#SetToFalse",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
        },
        "./src/stories/components/claim/ClaimCard.stories.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__),
                __webpack_require__.d(__webpack_exports__, {
                    Default: function () {
                        return Default;
                    },
                    __namedExportsOrder: function () {
                        return __namedExportsOrder;
                    },
                    default: function () {
                        return ClaimCard_stories;
                    },
                });
            var react = __webpack_require__("./node_modules/react/index.js"),
                col =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/es.object.assign.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/col/style/index.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/col/index.js"
                    )),
                row =
                    (__webpack_require__(
                        "./node_modules/antd/lib/row/style/index.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/row/index.js"
                    )),
                comment =
                    (__webpack_require__(
                        "./node_modules/antd/lib/comment/style/index.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/comment/index.js"
                    )),
                typography =
                    (__webpack_require__(
                        "./node_modules/antd/lib/typography/style/index.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/typography/index.js"
                    )),
                useTranslation =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/web.dom-collections.for-each.js"
                    ),
                    __webpack_require__(
                        "./node_modules/core-js/modules/es.string.trim.js"
                    ),
                    __webpack_require__(
                        "./node_modules/react-i18next/dist/es/useTranslation.js"
                    )),
                reviewColors = __webpack_require__(
                    "./src/constants/reviewColors.js"
                ),
                CardBase = __webpack_require__("./src/components/CardBase.tsx"),
                styled_components_browser_esm = __webpack_require__(
                    "./node_modules/styled-components/dist/styled-components.browser.esm.js"
                ),
                Claim_ClaimSummary = (0, styled_components_browser_esm.ZP)(
                    row.Z
                ).withConfig({
                    displayName: "ClaimSummary",
                    componentId: "sc-1u7niue-0",
                })([
                    'position:relative;background:#EEEEEE;display:flex;padding:12px 0px 0px 16px;margin:1em auto;border-radius:10px;&:after{content:" ";position:absolute;left:10px;top:-12px;border-top:none;border-right:12px solid transparent;border-left:12px solid transparent;border-bottom:12px solid #EEEEEE;}&.claim-review{background:rgba(219,159,13,0.3);&:after{border-bottom-color:rgba(219,159,13,0.3);}}',
                ]),
                Button = __webpack_require__("./src/components/Button.tsx"),
                ClaimCardHeader = __webpack_require__(
                    "./src/components/Claim/ClaimCardHeader.tsx"
                ),
                colors = __webpack_require__("./src/styles/colors.ts"),
                jsx_runtime = __webpack_require__(
                    "./node_modules/react/jsx-runtime.js"
                ),
                ImageClaim =
                    (react.createElement,
                    function ImageClaim(_ref) {
                        var src = _ref.src,
                            _ref$title = _ref.title,
                            title = void 0 === _ref$title ? "" : _ref$title;
                        return (0, jsx_runtime.jsx)("img", {
                            src: src,
                            alt: title + " claim",
                            style: {
                                maxWidth: "100%",
                                maxHeight: "5.5em",
                                objectFit: "contain",
                            },
                        });
                    });
            ImageClaim.displayName = "ImageClaim";
            var components_ImageClaim = ImageClaim;
            try {
                (ImageClaim.displayName = "ImageClaim"),
                    (ImageClaim.__docgenInfo = {
                        description: "",
                        displayName: "ImageClaim",
                        props: {
                            src: {
                                defaultValue: null,
                                description: "",
                                name: "src",
                                required: !0,
                                type: { name: "any" },
                            },
                            title: {
                                defaultValue: { value: "" },
                                description: "",
                                name: "title",
                                required: !1,
                                type: { name: "string" },
                            },
                        },
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/ImageClaim.tsx#ImageClaim"
                        ] = {
                            docgenInfo: ImageClaim.__docgenInfo,
                            name: "ImageClaim",
                            path: "src/components/ImageClaim.tsx#ImageClaim",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
            var enums = __webpack_require__("./src/types/enums.ts"),
                Paragraph = (react.createElement, typography.Z.Paragraph),
                ClaimSummaryContent = function ClaimSummaryContent(_ref) {
                    var _contentProps,
                        href = _ref.href,
                        claimContent = _ref.claimContent,
                        claimTitle = _ref.claimTitle,
                        contentModel = _ref.contentModel,
                        t = (0, useTranslation.$)().t,
                        isImage = contentModel === enums.BN.Image,
                        _contentProps$content = (((_contentProps = {})[
                            enums.BN.Speech
                        ] = {
                            linkText: "claim:cardLinkToFullText",
                            title: claimContent,
                            contentHeight: "6.4em",
                        }),
                        (_contentProps[enums.BN.Image] = {
                            linkText: "claim:cardLinkToImage",
                            title: claimTitle,
                            contentHeight: "1.6em",
                        }),
                        (_contentProps[enums.BN.Debate] = {
                            linkText: "claim:cardLinkToDebate",
                            title: claimTitle,
                            contentHeight: "5.3em",
                        }),
                        _contentProps)[contentModel],
                        linkText = _contentProps$content.linkText,
                        title = _contentProps$content.title,
                        contentHeight = _contentProps$content.contentHeight,
                        elipsizedTitleProps = isImage
                            ? {
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                              }
                            : {};
                    return (0, jsx_runtime.jsxs)(col.Z, {
                        children: [
                            (0, jsx_runtime.jsx)(Paragraph, {
                                style: { marginBottom: 0 },
                                ellipsis: { rows: 4, expandable: !1 },
                                children: (0, jsx_runtime.jsxs)("cite", {
                                    style: { fontStyle: "normal" },
                                    children: [
                                        (0, jsx_runtime.jsx)("p", {
                                            style: Object.assign(
                                                {
                                                    fontSize: 16,
                                                    color: colors.Z
                                                        .blackPrimary,
                                                    fontWeight: 400,
                                                    margin: 0,
                                                    lineHeight: 1.6,
                                                    height: contentHeight,
                                                },
                                                elipsizedTitleProps
                                            ),
                                            children: title,
                                        }),
                                        isImage &&
                                            (0, jsx_runtime.jsx)(
                                                components_ImageClaim,
                                                {
                                                    src: claimContent.content,
                                                    title: title,
                                                }
                                            ),
                                    ],
                                }),
                            }),
                            (0, jsx_runtime.jsx)("a", {
                                href: href,
                                style: {
                                    fontSize: 14,
                                    color: colors.Z.bluePrimary,
                                    fontWeight: "bold",
                                    textDecoration: "underline",
                                },
                                "data-cy": "testSeeFullSpeech",
                                children: t(linkText),
                            }),
                        ],
                    });
                };
            ClaimSummaryContent.displayName = "ClaimSummaryContent";
            var Claim_ClaimSummaryContent = ClaimSummaryContent;
            try {
                (ClaimSummaryContent.displayName = "ClaimSummaryContent"),
                    (ClaimSummaryContent.__docgenInfo = {
                        description: "",
                        displayName: "ClaimSummaryContent",
                        props: {
                            claimContent: {
                                defaultValue: null,
                                description: "",
                                name: "claimContent",
                                required: !0,
                                type: { name: "any" },
                            },
                            claimTitle: {
                                defaultValue: null,
                                description: "",
                                name: "claimTitle",
                                required: !0,
                                type: { name: "string" },
                            },
                            href: {
                                defaultValue: null,
                                description: "",
                                name: "href",
                                required: !0,
                                type: { name: "string" },
                            },
                            isImage: {
                                defaultValue: null,
                                description: "",
                                name: "isImage",
                                required: !1,
                                type: { name: "boolean" },
                            },
                            isDebate: {
                                defaultValue: null,
                                description: "",
                                name: "isDebate",
                                required: !1,
                                type: { name: "boolean" },
                            },
                            contentModel: {
                                defaultValue: null,
                                description: "",
                                name: "contentModel",
                                required: !0,
                                type: {
                                    name: "enum",
                                    value: [
                                        { value: '"Speech"' },
                                        { value: '"Image"' },
                                        { value: '"Debate"' },
                                    ],
                                },
                            },
                        },
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/Claim/ClaimSummaryContent.tsx#ClaimSummaryContent"
                        ] = {
                            docgenInfo: ClaimSummaryContent.__docgenInfo,
                            name: "ClaimSummaryContent",
                            path: "src/components/Claim/ClaimSummaryContent.tsx#ClaimSummaryContent",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
            __webpack_require__(
                "./node_modules/core-js/modules/es.array.map.js"
            );
            var ClaimSentence = __webpack_require__(
                    "./src/components/Claim/ClaimSentence.tsx"
                ),
                es = __webpack_require__(
                    "./node_modules/react-redux/es/index.js"
                ),
                actions = __webpack_require__("./src/store/actions.ts"),
                axios = __webpack_require__("./node_modules/axios/index.js"),
                request = __webpack_require__
                    .n(axios)()
                    .create({ withCredentials: !0, baseURL: "/api/sentence" }),
                sentenceApi = {
                    deleteSentenceTopic: function deleteSentenceTopic(
                        topics,
                        data_hash
                    ) {
                        return request
                            .put("/" + data_hash, topics)
                            .then(function (response) {
                                return response.data;
                            })
                            .catch(function (err) {
                                throw err;
                            });
                    },
                    getSentenceTopicsByDatahash:
                        function getSentenceTopicsByDatahash(data_hash) {
                            return request
                                .get("/" + data_hash)
                                .then(function (response) {
                                    return response.data;
                                })
                                .catch(function (err) {
                                    throw err;
                                });
                        },
                },
                ClaimParagraph =
                    (react.createElement,
                    function ClaimParagraph(_ref) {
                        var paragraph = _ref.paragraph,
                            showHighlights = _ref.showHighlights,
                            _handleSentenceClick = _ref.handleSentenceClick,
                            dispatch = (0, es.I0)(),
                            sentences = paragraph.content;
                        return (0, jsx_runtime.jsx)("p", {
                            id: paragraph.props.id,
                            children: sentences.map(function (sentence) {
                                return (0, jsx_runtime.jsx)(
                                    ClaimSentence.Z,
                                    {
                                        handleSentenceClick:
                                            function handleSentenceClick() {
                                                sentenceApi
                                                    .getSentenceTopicsByDatahash(
                                                        sentence.data_hash
                                                    )
                                                    .then(function (
                                                        sentenceWithTopics
                                                    ) {
                                                        dispatch(
                                                            actions.Z.setSelectContent(
                                                                sentenceWithTopics
                                                            )
                                                        );
                                                    })
                                                    .catch(function (e) {
                                                        return e;
                                                    }),
                                                    _handleSentenceClick &&
                                                        _handleSentenceClick();
                                            },
                                        content: sentence.content,
                                        properties: sentence.props,
                                        data_hash: sentence.data_hash,
                                        showHighlights: showHighlights,
                                    },
                                    sentence.props.id
                                );
                            }),
                        });
                    });
            ClaimParagraph.displayName = "ClaimParagraph";
            var Claim_ClaimParagraph = ClaimParagraph;
            try {
                (ClaimParagraph.displayName = "ClaimParagraph"),
                    (ClaimParagraph.__docgenInfo = {
                        description: "",
                        displayName: "ClaimParagraph",
                        props: {
                            paragraph: {
                                defaultValue: null,
                                description: "",
                                name: "paragraph",
                                required: !0,
                                type: { name: "any" },
                            },
                            showHighlights: {
                                defaultValue: null,
                                description: "",
                                name: "showHighlights",
                                required: !0,
                                type: { name: "any" },
                            },
                            handleSentenceClick: {
                                defaultValue: null,
                                description: "",
                                name: "handleSentenceClick",
                                required: !0,
                                type: { name: "any" },
                            },
                        },
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/Claim/ClaimParagraph.tsx#ClaimParagraph"
                        ] = {
                            docgenInfo: ClaimParagraph.__docgenInfo,
                            name: "ClaimParagraph",
                            path: "src/components/Claim/ClaimParagraph.tsx#ClaimParagraph",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
            react.createElement;
            var ClaimSpeechBody = function ClaimSpeechBody(props) {
                    return (0, jsx_runtime.jsx)(jsx_runtime.Fragment, {
                        children: props.paragraphs.map(function (paragraph) {
                            return (0,
                            jsx_runtime.jsx)(Claim_ClaimParagraph, { handleSentenceClick: props.handleSentenceClick, paragraph: paragraph, showHighlights: props.showHighlights }, paragraph.props.id);
                        }),
                    });
                },
                Claim_ClaimSpeechBody = ClaimSpeechBody;
            try {
                (ClaimSpeechBody.displayName = "ClaimSpeechBody"),
                    (ClaimSpeechBody.__docgenInfo = {
                        description: "",
                        displayName: "ClaimSpeechBody",
                        props: {
                            paragraphs: {
                                defaultValue: null,
                                description: "",
                                name: "paragraphs",
                                required: !0,
                                type: { name: "any" },
                            },
                            showHighlights: {
                                defaultValue: null,
                                description: "",
                                name: "showHighlights",
                                required: !0,
                                type: { name: "boolean" },
                            },
                            handleSentenceClick: {
                                defaultValue: null,
                                description: "",
                                name: "handleSentenceClick",
                                required: !1,
                                type: { name: "any" },
                            },
                        },
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/Claim/ClaimSpeechBody.tsx#ClaimSpeechBody"
                        ] = {
                            docgenInfo: ClaimSpeechBody.__docgenInfo,
                            name: "ClaimSpeechBody",
                            path: "src/components/Claim/ClaimSpeechBody.tsx#ClaimSpeechBody",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
            var store = __webpack_require__("./src/store/store.ts"),
                ClaimCard_Paragraph =
                    (react.createElement, typography.Z.Paragraph),
                CommentStyled = (0, styled_components_browser_esm.ZP)(
                    comment.Z
                ).withConfig({
                    displayName: "ClaimCard__CommentStyled",
                    componentId: "sc-bjzihv-0",
                })(["width:100%;.ant-comment-inner{padding:0;}"]),
                ClaimCard = function ClaimCard(_ref) {
                    var _claim$stats,
                        _claim$stats2,
                        personality = _ref.personality,
                        claim = _ref.claim,
                        _ref$collapsed = _ref.collapsed,
                        collapsed = void 0 === _ref$collapsed || _ref$collapsed,
                        t = (0, useTranslation.$)().t,
                        dispatch = (0, es.I0)(),
                        selectedClaim = (0, store.CG)(function (state) {
                            return state;
                        }).selectedClaim,
                        review =
                            null == claim ||
                            null === (_claim$stats = claim.stats) ||
                            void 0 === _claim$stats
                                ? void 0
                                : _claim$stats.reviews[0],
                        paragraphs = claim.content,
                        _useState = (0, react.useState)(""),
                        claimContent = _useState[0],
                        setClaimContent = _useState[1],
                        isSpeech =
                            (null == claim ? void 0 : claim.contentModel) ===
                            enums.BN.Speech,
                        isDebate =
                            (null == claim ? void 0 : claim.contentModel) ===
                            enums.BN.Debate,
                        isInsideDebate =
                            (null == selectedClaim
                                ? void 0
                                : selectedClaim.contentModel) ===
                            enums.BN.Debate,
                        href = personality.slug
                            ? "/personality/" +
                              personality.slug +
                              "/claim/" +
                              claim.slug
                            : "/claim/" + claim._id;
                    return (
                        isDebate && (href = "/claim/" + claim._id + "/debate"),
                        (0, react.useEffect)(
                            function () {
                                isSpeech
                                    ? (function CreateFirstParagraph() {
                                          var textContent = "";
                                          paragraphs.forEach(function (
                                              paragraph
                                          ) {
                                              paragraph.content.forEach(
                                                  function (sentence) {
                                                      textContent +=
                                                          sentence.content +
                                                          " ";
                                                  }
                                              );
                                          }),
                                              setClaimContent(
                                                  textContent.trim()
                                              );
                                      })()
                                    : setClaimContent(claim.content);
                            },
                            [claim.content, isSpeech, paragraphs]
                        ),
                        claim
                            ? (0, jsx_runtime.jsxs)(CardBase.Z, {
                                  style: { padding: "16px 12px" },
                                  children: [
                                      (0, jsx_runtime.jsx)(row.Z, {
                                          style: { width: "100%" },
                                          children: (0, jsx_runtime.jsx)(
                                              CommentStyled,
                                              {
                                                  author: (0, jsx_runtime.jsx)(
                                                      ClaimCardHeader.Z,
                                                      {
                                                          personality:
                                                              personality,
                                                          date:
                                                              null == claim
                                                                  ? void 0
                                                                  : claim.date,
                                                          claimType:
                                                              null == claim
                                                                  ? void 0
                                                                  : claim.contentModel,
                                                      }
                                                  ),
                                                  content: (0, jsx_runtime.jsx)(
                                                      Claim_ClaimSummary,
                                                      {
                                                          style: {
                                                              padding:
                                                                  "12px 16px",
                                                              width: "100%",
                                                          },
                                                          children: collapsed
                                                              ? (0,
                                                                jsx_runtime.jsx)(
                                                                    Claim_ClaimSummaryContent,
                                                                    {
                                                                        claimTitle:
                                                                            null ==
                                                                            claim
                                                                                ? void 0
                                                                                : claim.title,
                                                                        claimContent:
                                                                            claimContent,
                                                                        contentModel:
                                                                            null ==
                                                                            claim
                                                                                ? void 0
                                                                                : claim.contentModel,
                                                                        href: href,
                                                                    }
                                                                )
                                                              : (0,
                                                                jsx_runtime.jsx)(
                                                                    Claim_ClaimSpeechBody,
                                                                    {
                                                                        handleSentenceClick:
                                                                            function dispatchPersonalityAndClaim() {
                                                                                isInsideDebate ||
                                                                                    dispatch(
                                                                                        actions.Z.setSelectClaim(
                                                                                            claim
                                                                                        )
                                                                                    ),
                                                                                    dispatch(
                                                                                        actions.Z.setSelectPersonality(
                                                                                            personality
                                                                                        )
                                                                                    );
                                                                            },
                                                                        paragraphs:
                                                                            paragraphs,
                                                                        showHighlights:
                                                                            !0,
                                                                    }
                                                                ),
                                                      }
                                                  ),
                                              }
                                          ),
                                      }),
                                      (0, jsx_runtime.jsxs)(row.Z, {
                                          style: {
                                              padding: "4px 15px 0 0",
                                              width: "100%",
                                          },
                                          justify: "space-between",
                                          children: [
                                              (0, jsx_runtime.jsxs)(col.Z, {
                                                  span: 16,
                                                  style: {
                                                      display: "flex",
                                                      flexWrap: "wrap",
                                                  },
                                                  children: [
                                                      (null == claim
                                                          ? void 0
                                                          : claim.stats) &&
                                                          (0, jsx_runtime.jsx)(
                                                              "p",
                                                              {
                                                                  style: {
                                                                      width: "100%",
                                                                      fontSize:
                                                                          "14px",
                                                                      lineHeight:
                                                                          "18px",
                                                                      color: colors
                                                                          .Z
                                                                          .blackSecondary,
                                                                      margin: 0,
                                                                  },
                                                                  children: t(
                                                                      "claim:metricsHeaderInfo",
                                                                      {
                                                                          totalReviews:
                                                                              null ==
                                                                                  claim ||
                                                                              null ===
                                                                                  (_claim$stats2 =
                                                                                      claim.stats) ||
                                                                              void 0 ===
                                                                                  _claim$stats2
                                                                                  ? void 0
                                                                                  : _claim$stats2.total,
                                                                      }
                                                                  ),
                                                              }
                                                          ),
                                                      " ",
                                                      (0, jsx_runtime.jsx)(
                                                          ClaimCard_Paragraph,
                                                          {
                                                              style: {
                                                                  fontSize:
                                                                      "10px",
                                                                  lineHeight:
                                                                      "18px",
                                                                  marginTop: 5,
                                                                  marginBottom: 0,
                                                                  display:
                                                                      "flex",
                                                              },
                                                              children:
                                                                  review &&
                                                                  (0,
                                                                  jsx_runtime.jsxs)(
                                                                      "span",
                                                                      {
                                                                          style: {
                                                                              margin: 0,
                                                                          },
                                                                          children:
                                                                              [
                                                                                  t(
                                                                                      "claim:cardOverallReviewPrefix"
                                                                                  ),
                                                                                  (0,
                                                                                  jsx_runtime.jsx)(
                                                                                      "span",
                                                                                      {
                                                                                          style: {
                                                                                              color:
                                                                                                  reviewColors
                                                                                                      .Z[
                                                                                                      null ==
                                                                                                      review
                                                                                                          ? void 0
                                                                                                          : review._id
                                                                                                  ] ||
                                                                                                  "#000",
                                                                                              fontWeight: 900,
                                                                                              textTransform:
                                                                                                  "uppercase",
                                                                                              margin: "0px 3px",
                                                                                          },
                                                                                          children:
                                                                                              t(
                                                                                                  "claimReviewForm:" +
                                                                                                      (null ==
                                                                                                      review
                                                                                                          ? void 0
                                                                                                          : review._id)
                                                                                              ),
                                                                                      }
                                                                                  ),
                                                                                  "(",
                                                                                  null ==
                                                                                  review
                                                                                      ? void 0
                                                                                      : review.count,
                                                                                  ")",
                                                                              ],
                                                                      }
                                                                  ),
                                                          }
                                                      ),
                                                  ],
                                              }),
                                              (0, jsx_runtime.jsx)(col.Z, {
                                                  children:
                                                      !isInsideDebate &&
                                                      (0, jsx_runtime.jsx)(
                                                          Button.Z,
                                                          {
                                                              type: Button.L
                                                                  .blue,
                                                              href: href,
                                                              "data-cy":
                                                                  personality.name,
                                                              children: (0,
                                                              jsx_runtime.jsx)(
                                                                  "span",
                                                                  {
                                                                      style: {
                                                                          color: colors
                                                                              .Z
                                                                              .white,
                                                                          fontSize: 16,
                                                                          fontWeight: 400,
                                                                          margin: 0,
                                                                          padding: 0,
                                                                          lineHeight:
                                                                              "24px",
                                                                      },
                                                                      children:
                                                                          t(
                                                                              "claim:cardReviewButton"
                                                                          ),
                                                                  }
                                                              ),
                                                          }
                                                      ),
                                              }),
                                          ],
                                      }),
                                  ],
                              })
                            : (0, jsx_runtime.jsx)("div", {})
                    );
                };
            ClaimCard.displayName = "ClaimCard";
            var Claim_ClaimCard = ClaimCard;
            try {
                (ClaimCard.displayName = "ClaimCard"),
                    (ClaimCard.__docgenInfo = {
                        description: "",
                        displayName: "ClaimCard",
                        props: {
                            personality: {
                                defaultValue: null,
                                description: "",
                                name: "personality",
                                required: !0,
                                type: { name: "any" },
                            },
                            claim: {
                                defaultValue: null,
                                description: "",
                                name: "claim",
                                required: !0,
                                type: { name: "any" },
                            },
                            collapsed: {
                                defaultValue: { value: "true" },
                                description: "",
                                name: "collapsed",
                                required: !1,
                                type: { name: "boolean" },
                            },
                        },
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/Claim/ClaimCard.tsx#ClaimCard"
                        ] = {
                            docgenInfo: ClaimCard.__docgenInfo,
                            name: "ClaimCard",
                            path: "src/components/Claim/ClaimCard.tsx#ClaimCard",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
            var fixtures = __webpack_require__("./src/stories/fixtures.ts"),
                ClaimCard_stories =
                    (react.createElement,
                    {
                        title: "Components/Claim/ClaimCard",
                        component: Claim_ClaimCard,
                        args: { personality: fixtures.Ep, claim: fixtures.QS },
                        decorators: [
                            function (Story) {
                                return (0, jsx_runtime.jsx)("div", {
                                    style: { width: "500px" },
                                    children: (0, jsx_runtime.jsx)(Story, {}),
                                });
                            },
                        ],
                    }),
                Template = function Template(args) {
                    return (0, jsx_runtime.jsx)(
                        Claim_ClaimCard,
                        Object.assign({}, args)
                    );
                };
            Template.displayName = "Template";
            var Default = Template.bind({});
            (Default.args = {}),
                (Default.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => (\n    <ClaimCard {...args} />\n)",
                        },
                    },
                    Default.parameters
                ));
            var __namedExportsOrder = ["Default"];
        },
        "./src/stories/components/claim/ClaimCardHeader.stories.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__),
                __webpack_require__.d(__webpack_exports__, {
                    Default: function () {
                        return Default;
                    },
                    __namedExportsOrder: function () {
                        return __namedExportsOrder;
                    },
                });
            var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    "./node_modules/react/index.js"
                ),
                _components_Claim_ClaimCardHeader__WEBPACK_IMPORTED_MODULE_2__ =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/es.object.assign.js"
                    ),
                    __webpack_require__(
                        "./src/components/Claim/ClaimCardHeader.tsx"
                    )),
                _fixtures__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
                    "./src/stories/fixtures.ts"
                ),
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ =
                    __webpack_require__("./node_modules/react/jsx-runtime.js");
            react__WEBPACK_IMPORTED_MODULE_0__.createElement;
            __webpack_exports__.default = {
                title: "Components/Claim/ClaimCardHeader",
                component:
                    _components_Claim_ClaimCardHeader__WEBPACK_IMPORTED_MODULE_2__.Z,
                args: {
                    personality: _fixtures__WEBPACK_IMPORTED_MODULE_3__.Ep,
                    date: "2022-04-10T13:05:49.334Z",
                    claimType: "speech",
                },
            };
            var Template = function Template(args) {
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(
                    _components_Claim_ClaimCardHeader__WEBPACK_IMPORTED_MODULE_2__.Z,
                    Object.assign({}, args)
                );
            };
            Template.displayName = "Template";
            var Default = Template.bind({});
            (Default.args = {}),
                (Default.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => (\n    <ClaimCardHeader {...args} />\n)",
                        },
                    },
                    Default.parameters
                ));
            var __namedExportsOrder = ["Default"];
        },
        "./src/stories/components/claim/ClaimSentence.stories.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__),
                __webpack_require__.d(__webpack_exports__, {
                    WithHighlights: function () {
                        return WithHighlights;
                    },
                    WithoutHighlights: function () {
                        return WithoutHighlights;
                    },
                    __namedExportsOrder: function () {
                        return __namedExportsOrder;
                    },
                });
            var _Users_mateus_wmf_workspace_aletheia_fact_aletheia_node_modules_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_6__ =
                    __webpack_require__(
                        "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js"
                    ),
                react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    "./node_modules/react/index.js"
                ),
                _components_Claim_ClaimSentence__WEBPACK_IMPORTED_MODULE_3__ =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/es.array.concat.js"
                    ),
                    __webpack_require__(
                        "./node_modules/core-js/modules/es.object.assign.js"
                    ),
                    __webpack_require__(
                        "./src/components/Claim/ClaimSentence.tsx"
                    )),
                _fixtures__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
                    "./src/stories/fixtures.ts"
                ),
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ =
                    __webpack_require__("./node_modules/react/jsx-runtime.js");
            react__WEBPACK_IMPORTED_MODULE_0__.createElement;
            __webpack_exports__.default = {
                title: "Components/Claim/ClaimSentence",
                component:
                    _components_Claim_ClaimSentence__WEBPACK_IMPORTED_MODULE_3__.Z,
                args: {
                    showHighlights: !0,
                    classification: "true",
                    properties: {
                        id: 1,
                        topClassification: { classification: "true", count: 1 },
                    },
                    content:
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                    generateHref: function generateHref() {
                        return "href";
                    },
                },
                argTypes: {
                    classification: {
                        options: ["none"].concat(
                            (0,
                            _Users_mateus_wmf_workspace_aletheia_fact_aletheia_node_modules_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_6__.Z)(
                                _fixtures__WEBPACK_IMPORTED_MODULE_4__.xt
                            )
                        ),
                        control: { type: "select" },
                    },
                },
            };
            var Template = function Template(args) {
                return (
                    (args.properties.topClassification.classification =
                        args.classification),
                    (args.properties.topClassification.count =
                        "none" === args.classification ? void 0 : 1),
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(
                        _components_Claim_ClaimSentence__WEBPACK_IMPORTED_MODULE_3__.Z,
                        Object.assign({}, args)
                    )
                );
            };
            Template.displayName = "Template";
            var WithHighlights = Template.bind({});
            WithHighlights.args = {};
            var WithoutHighlights = Template.bind({});
            (WithoutHighlights.args = {
                showHighlights: !1,
                classification: "none",
            }),
                (WithHighlights.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => {\n    args.properties.topClassification.classification = args.classification\n    args.properties.topClassification.count = args.classification === 'none' ? undefined : 1\n    return (\n        <ClaimSentence {...args} />\n    )\n}",
                        },
                    },
                    WithHighlights.parameters
                )),
                (WithoutHighlights.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => {\n    args.properties.topClassification.classification = args.classification\n    args.properties.topClassification.count = args.classification === 'none' ? undefined : 1\n    return (\n        <ClaimSentence {...args} />\n    )\n}",
                        },
                    },
                    WithoutHighlights.parameters
                ));
            var __namedExportsOrder = ["WithHighlights", "WithoutHighlights"];
        },
        "./src/stories/components/claim/ClaimSentenceCard.stories.tsx":
            function (
                __unused_webpack_module,
                __webpack_exports__,
                __webpack_require__
            ) {
                "use strict";
                __webpack_require__.r(__webpack_exports__),
                    __webpack_require__.d(__webpack_exports__, {
                        Default: function () {
                            return Default;
                        },
                        __namedExportsOrder: function () {
                            return __namedExportsOrder;
                        },
                    });
                var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                        "./node_modules/react/index.js"
                    ),
                    _components_Claim_ClaimSentence__WEBPACK_IMPORTED_MODULE_2__ =
                        (__webpack_require__(
                            "./node_modules/core-js/modules/es.object.assign.js"
                        ),
                        __webpack_require__(
                            "./src/components/Claim/ClaimSentence.tsx"
                        )),
                    _fixtures__WEBPACK_IMPORTED_MODULE_3__ =
                        __webpack_require__("./src/stories/fixtures.ts"),
                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ =
                        __webpack_require__(
                            "./node_modules/react/jsx-runtime.js"
                        );
                react__WEBPACK_IMPORTED_MODULE_0__.createElement;
                __webpack_exports__.default = {
                    title: "Components/Claim/ClaimSentence",
                    component:
                        _components_Claim_ClaimSentence__WEBPACK_IMPORTED_MODULE_2__.Z,
                    args: {
                        claimType: "speech",
                        summaryClassName: "claim-review",
                        personality: _fixtures__WEBPACK_IMPORTED_MODULE_3__.Ep,
                        sentence: {
                            date: "2022-04-10T13:05:49.334Z",
                            content:
                                "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                        },
                    },
                    argTypes: {
                        claimType: { options: ["speech", "twitter"] },
                        summaryClassName: {
                            options: ["claim-review", "none"],
                            control: { type: "radio" },
                        },
                    },
                    decorators: [
                        function (Story) {
                            return (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(
                                "div",
                                {
                                    style: { width: "500px" },
                                    children: (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(
                                        Story,
                                        {}
                                    ),
                                }
                            );
                        },
                    ],
                };
                var Template = function Template(args) {
                    return (0,
                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(
                        _components_Claim_ClaimSentence__WEBPACK_IMPORTED_MODULE_2__.Z,
                        Object.assign({}, args)
                    );
                };
                Template.displayName = "Template";
                var Default = Template.bind({});
                (Default.args = {}),
                    (Default.parameters = Object.assign(
                        {
                            storySource: {
                                source: "(args) => (\n    <ClaimSentence {...args} />\n)",
                            },
                        },
                        Default.parameters
                    ));
                var __namedExportsOrder = ["Default"];
            },
        "./src/stories/components/inputs/AletheiaInput.stories.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__),
                __webpack_require__.d(__webpack_exports__, {
                    Default: function () {
                        return Default;
                    },
                    __namedExportsOrder: function () {
                        return __namedExportsOrder;
                    },
                });
            var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    "./node_modules/react/index.js"
                ),
                _components_AletheiaInput__WEBPACK_IMPORTED_MODULE_2__ =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/es.object.assign.js"
                    ),
                    __webpack_require__("./src/components/AletheiaInput.tsx")),
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ =
                    __webpack_require__("./node_modules/react/jsx-runtime.js");
            react__WEBPACK_IMPORTED_MODULE_0__.createElement;
            __webpack_exports__.default = {
                title: "Components/Inputs/Input",
                component:
                    _components_AletheiaInput__WEBPACK_IMPORTED_MODULE_2__.Z,
                decorators: [
                    function (Story) {
                        return (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(
                            "div",
                            {
                                style: { width: "500px" },
                                children: (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(
                                    Story,
                                    {}
                                ),
                            }
                        );
                    },
                ],
            };
            var Default = function Default() {
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(
                    _components_AletheiaInput__WEBPACK_IMPORTED_MODULE_2__.Z,
                    { placeholder: "Default input" }
                );
            };
            (Default.displayName = "Default"),
                (Default.parameters = Object.assign(
                    {
                        storySource: {
                            source: "() => (<AletheiaInput placeholder='Default input' />)",
                        },
                    },
                    Default.parameters
                ));
            var __namedExportsOrder = ["Default"];
        },
        "./src/stories/components/inputs/ClaimReviewSelect.stories.tsx":
            function (
                __unused_webpack_module,
                __webpack_exports__,
                __webpack_require__
            ) {
                "use strict";
                __webpack_require__.r(__webpack_exports__),
                    __webpack_require__.d(__webpack_exports__, {
                        Default: function () {
                            return Default;
                        },
                        __namedExportsOrder: function () {
                            return ClaimReviewSelect_stories_namedExportsOrder;
                        },
                        default: function () {
                            return ClaimReviewSelect_stories;
                        },
                    });
                var react = __webpack_require__(
                        "./node_modules/react/index.js"
                    ),
                    lib_select =
                        (__webpack_require__(
                            "./node_modules/core-js/modules/es.object.assign.js"
                        ),
                        __webpack_require__(
                            "./node_modules/antd/lib/select/style/index.js"
                        ),
                        __webpack_require__(
                            "./node_modules/antd/lib/select/index.js"
                        )),
                    styled_components_browser_esm = __webpack_require__(
                        "./node_modules/styled-components/dist/styled-components.browser.esm.js"
                    ),
                    store = __webpack_require__("./src/store/store.ts"),
                    colors = __webpack_require__("./src/styles/colors.ts"),
                    ClassificationText = __webpack_require__(
                        "./src/components/ClassificationText.tsx"
                    ),
                    lib_radio =
                        (__webpack_require__(
                            "./node_modules/antd/lib/radio/style/index.js"
                        ),
                        __webpack_require__(
                            "./node_modules/antd/lib/radio/index.js"
                        )),
                    useTranslation = __webpack_require__(
                        "./node_modules/react-i18next/dist/es/useTranslation.js"
                    ),
                    Button = __webpack_require__("./src/components/Button.tsx"),
                    AletheiaModal_style = __webpack_require__(
                        "./src/components/Modal/AletheiaModal.style.tsx"
                    ),
                    jsx_runtime = __webpack_require__(
                        "./node_modules/react/jsx-runtime.js"
                    ),
                    ClassificationModal =
                        (react.createElement,
                        function ClassificationModal(_ref) {
                            var visible = _ref.visible,
                                value = _ref.value,
                                setValue = _ref.setValue,
                                handleOk = _ref.handleOk,
                                handleCancel = _ref.handleCancel,
                                t = (0, useTranslation.$)().t;
                            return (0, jsx_runtime.jsxs)(
                                AletheiaModal_style.Rt,
                                {
                                    visible: visible,
                                    footer: !1,
                                    onCancel: handleCancel,
                                    setValue: setValue,
                                    title: t(
                                        "claimReviewForm:classificationLabel"
                                    ),
                                    style: {
                                        display: "flex",
                                        alingItens: "center",
                                    },
                                    children: [
                                        (0, jsx_runtime.jsxs)(
                                            lib_radio.ZP.Group,
                                            {
                                                onChange:
                                                    function onChangeRadio(e) {
                                                        setValue(
                                                            e.target.value
                                                        );
                                                    },
                                                value: value,
                                                style: {
                                                    display: "flex",
                                                    gap: "24px",
                                                    flexDirection: "column",
                                                },
                                                children: [
                                                    (0, jsx_runtime.jsx)(
                                                        lib_radio.ZP,
                                                        {
                                                            value: "not-fact",
                                                            children: (0,
                                                            jsx_runtime.jsx)(
                                                                ClassificationText.Z,
                                                                {
                                                                    classification:
                                                                        "not-fact",
                                                                }
                                                            ),
                                                        }
                                                    ),
                                                    (0, jsx_runtime.jsx)(
                                                        lib_radio.ZP,
                                                        {
                                                            value: "trustworthy",
                                                            children: (0,
                                                            jsx_runtime.jsx)(
                                                                ClassificationText.Z,
                                                                {
                                                                    classification:
                                                                        "trustworthy",
                                                                }
                                                            ),
                                                        }
                                                    ),
                                                    (0, jsx_runtime.jsx)(
                                                        lib_radio.ZP,
                                                        {
                                                            value: "trustworthy-but",
                                                            children: (0,
                                                            jsx_runtime.jsx)(
                                                                ClassificationText.Z,
                                                                {
                                                                    classification:
                                                                        "trustworthy-but",
                                                                }
                                                            ),
                                                        }
                                                    ),
                                                    (0, jsx_runtime.jsx)(
                                                        lib_radio.ZP,
                                                        {
                                                            value: "arguable",
                                                            children: (0,
                                                            jsx_runtime.jsx)(
                                                                ClassificationText.Z,
                                                                {
                                                                    classification:
                                                                        "arguable",
                                                                }
                                                            ),
                                                        }
                                                    ),
                                                    (0, jsx_runtime.jsx)(
                                                        lib_radio.ZP,
                                                        {
                                                            value: "misleading",
                                                            children: (0,
                                                            jsx_runtime.jsx)(
                                                                ClassificationText.Z,
                                                                {
                                                                    classification:
                                                                        "misleading",
                                                                }
                                                            ),
                                                        }
                                                    ),
                                                    (0, jsx_runtime.jsx)(
                                                        lib_radio.ZP,
                                                        {
                                                            value: "false",
                                                            children: (0,
                                                            jsx_runtime.jsx)(
                                                                ClassificationText.Z,
                                                                {
                                                                    classification:
                                                                        "false",
                                                                }
                                                            ),
                                                        }
                                                    ),
                                                    (0, jsx_runtime.jsx)(
                                                        lib_radio.ZP,
                                                        {
                                                            value: "unsustainable",
                                                            children: (0,
                                                            jsx_runtime.jsx)(
                                                                ClassificationText.Z,
                                                                {
                                                                    classification:
                                                                        "unsustainable",
                                                                }
                                                            ),
                                                        }
                                                    ),
                                                    (0, jsx_runtime.jsx)(
                                                        lib_radio.ZP,
                                                        {
                                                            value: "exaggerated",
                                                            children: (0,
                                                            jsx_runtime.jsx)(
                                                                ClassificationText.Z,
                                                                {
                                                                    classification:
                                                                        "exaggerated",
                                                                }
                                                            ),
                                                        }
                                                    ),
                                                    (0, jsx_runtime.jsx)(
                                                        lib_radio.ZP,
                                                        {
                                                            value: "unverifiable",
                                                            children: (0,
                                                            jsx_runtime.jsx)(
                                                                ClassificationText.Z,
                                                                {
                                                                    classification:
                                                                        "unverifiable",
                                                                }
                                                            ),
                                                        }
                                                    ),
                                                ],
                                            }
                                        ),
                                        (0, jsx_runtime.jsxs)("div", {
                                            style: {
                                                marginTop: 30,
                                                display: "flex",
                                            },
                                            children: [
                                                (0, jsx_runtime.jsx)(
                                                    AletheiaModal_style.IB,
                                                    {
                                                        type: "text",
                                                        onClick: handleCancel,
                                                        style: { width: "62%" },
                                                        children: (0,
                                                        jsx_runtime.jsx)(
                                                            "span",
                                                            {
                                                                children: t(
                                                                    "orderModal:cancelButton"
                                                                ),
                                                            }
                                                        ),
                                                    }
                                                ),
                                                (0, jsx_runtime.jsx)(Button.Z, {
                                                    type: Button.L.blue,
                                                    onClick: handleOk,
                                                    style: {
                                                        width: "48%",
                                                        paddingTop: 0,
                                                    },
                                                    children: t(
                                                        "orderModal:okButton"
                                                    ),
                                                }),
                                            ],
                                        }),
                                    ],
                                }
                            );
                        });
                ClassificationModal.displayName = "ClassificationModal";
                var Form_ClassificationModal = ClassificationModal;
                try {
                    (ClassificationModal.displayName = "ClassificationModal"),
                        (ClassificationModal.__docgenInfo = {
                            description: "",
                            displayName: "ClassificationModal",
                            props: {
                                visible: {
                                    defaultValue: null,
                                    description: "",
                                    name: "visible",
                                    required: !0,
                                    type: { name: "any" },
                                },
                                value: {
                                    defaultValue: null,
                                    description: "",
                                    name: "value",
                                    required: !0,
                                    type: { name: "any" },
                                },
                                setValue: {
                                    defaultValue: null,
                                    description: "",
                                    name: "setValue",
                                    required: !0,
                                    type: { name: "any" },
                                },
                                handleOk: {
                                    defaultValue: null,
                                    description: "",
                                    name: "handleOk",
                                    required: !0,
                                    type: { name: "any" },
                                },
                                handleCancel: {
                                    defaultValue: null,
                                    description: "",
                                    name: "handleCancel",
                                    required: !0,
                                    type: { name: "any" },
                                },
                            },
                        }),
                        "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                            (STORYBOOK_REACT_CLASSES[
                                "src/components/Form/ClassificationModal.tsx#ClassificationModal"
                            ] = {
                                docgenInfo: ClassificationModal.__docgenInfo,
                                name: "ClassificationModal",
                                path: "src/components/Form/ClassificationModal.tsx#ClassificationModal",
                            });
                } catch (__react_docgen_typescript_loader_error) {}
                react.createElement;
                var Option = lib_select.Z.Option,
                    SelectInput = (0, styled_components_browser_esm.ZP)(
                        lib_select.Z
                    ).withConfig({
                        displayName: "ClaimReviewSelect__SelectInput",
                        componentId: "sc-1tz81gw-0",
                    })(
                        [
                            "background:",
                            ";box-shadow:0px 2px 2px rgba(0,0,0,0.25);border-radius:4px;border:none;height:40px;width:100%;.ant-select-selector{background:none !important;border:none !important;top:6px;.ant-select-selection-item{color:",
                            ";}}::placeholder{color:",
                            ";}:focus{border:none;box-shadow:0px 2px 2px rgba(0,0,0,0.25);}:active{border:none;}:hover{border:none;}",
                        ],
                        colors.Z.white,
                        colors.Z.blackSecondary,
                        colors.Z.blackSecondary
                    ),
                    ClaimReviewSelect = function ClaimReviewSelect(_ref) {
                        var type = _ref.type,
                            onChange = _ref.onChange,
                            defaultValue = _ref.defaultValue,
                            placeholder = _ref.placeholder,
                            vw = (0, store.CG)(function (state) {
                                return state;
                            }).vw,
                            _useState = (0, react.useState)(!1),
                            visible = _useState[0],
                            setVisible = _useState[1],
                            _useState2 = (0, react.useState)(defaultValue),
                            value = _useState2[0],
                            setValue = _useState2[1];
                        (0, react.useEffect)(
                            function () {
                                onChange(value);
                            },
                            [value, onChange]
                        );
                        return (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                            children: [
                                (0, jsx_runtime.jsxs)(SelectInput, {
                                    type: type,
                                    onChange: function onChangeSelect(e) {
                                        setValue(e);
                                    },
                                    onClick: function handleOnClick() {
                                        null != vw && vw.sm && setVisible(!0);
                                    },
                                    value: value,
                                    "data-cy": "testClassificationText",
                                    dropdownStyle: (null == vw
                                        ? void 0
                                        : vw.sm) && { display: "none" },
                                    children: [
                                        (0, jsx_runtime.jsx)(Option, {
                                            value: "",
                                            disabled: !0,
                                            children: placeholder,
                                        }),
                                        (0, jsx_runtime.jsx)(Option, {
                                            value: "not-fact",
                                            children: (0, jsx_runtime.jsx)(
                                                ClassificationText.Z,
                                                { classification: "not-fact" }
                                            ),
                                        }),
                                        (0, jsx_runtime.jsx)(Option, {
                                            value: "trustworthy",
                                            children: (0, jsx_runtime.jsx)(
                                                ClassificationText.Z,
                                                {
                                                    classification:
                                                        "trustworthy",
                                                }
                                            ),
                                        }),
                                        (0, jsx_runtime.jsx)(Option, {
                                            value: "trustworthy-but",
                                            children: (0, jsx_runtime.jsx)(
                                                ClassificationText.Z,
                                                {
                                                    classification:
                                                        "trustworthy-but",
                                                }
                                            ),
                                        }),
                                        (0, jsx_runtime.jsx)(Option, {
                                            value: "arguable",
                                            children: (0, jsx_runtime.jsx)(
                                                ClassificationText.Z,
                                                { classification: "arguable" }
                                            ),
                                        }),
                                        (0, jsx_runtime.jsx)(Option, {
                                            value: "misleading",
                                            children: (0, jsx_runtime.jsx)(
                                                ClassificationText.Z,
                                                { classification: "misleading" }
                                            ),
                                        }),
                                        (0, jsx_runtime.jsx)(Option, {
                                            value: "false",
                                            children: (0, jsx_runtime.jsx)(
                                                ClassificationText.Z,
                                                { classification: "false" }
                                            ),
                                        }),
                                        (0, jsx_runtime.jsx)(Option, {
                                            value: "unsustainable",
                                            children: (0, jsx_runtime.jsx)(
                                                ClassificationText.Z,
                                                {
                                                    classification:
                                                        "unsustainable",
                                                }
                                            ),
                                        }),
                                        (0, jsx_runtime.jsx)(Option, {
                                            value: "exaggerated",
                                            children: (0, jsx_runtime.jsx)(
                                                ClassificationText.Z,
                                                {
                                                    classification:
                                                        "exaggerated",
                                                }
                                            ),
                                        }),
                                        (0, jsx_runtime.jsx)(Option, {
                                            value: "unverifiable",
                                            children: (0, jsx_runtime.jsx)(
                                                ClassificationText.Z,
                                                {
                                                    classification:
                                                        "unverifiable",
                                                }
                                            ),
                                        }),
                                    ],
                                }),
                                (0, jsx_runtime.jsx)(Form_ClassificationModal, {
                                    visible: visible,
                                    value: value,
                                    setValue: setValue,
                                    handleOk: function handleChangeOk() {
                                        setVisible(!1);
                                    },
                                    handleCancel: function handleCloseModal() {
                                        setVisible(!1);
                                    },
                                }),
                            ],
                        });
                    },
                    Form_ClaimReviewSelect = ClaimReviewSelect;
                try {
                    (ClaimReviewSelect.displayName = "ClaimReviewSelect"),
                        (ClaimReviewSelect.__docgenInfo = {
                            description: "",
                            displayName: "ClaimReviewSelect",
                            props: {
                                type: {
                                    defaultValue: null,
                                    description: "",
                                    name: "type",
                                    required: !0,
                                    type: { name: "any" },
                                },
                                onChange: {
                                    defaultValue: null,
                                    description: "",
                                    name: "onChange",
                                    required: !0,
                                    type: { name: "any" },
                                },
                                defaultValue: {
                                    defaultValue: null,
                                    description: "",
                                    name: "defaultValue",
                                    required: !0,
                                    type: { name: "any" },
                                },
                                placeholder: {
                                    defaultValue: null,
                                    description: "",
                                    name: "placeholder",
                                    required: !0,
                                    type: { name: "any" },
                                },
                            },
                        }),
                        "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                            (STORYBOOK_REACT_CLASSES[
                                "src/components/Form/ClaimReviewSelect.tsx#ClaimReviewSelect"
                            ] = {
                                docgenInfo: ClaimReviewSelect.__docgenInfo,
                                name: "ClaimReviewSelect",
                                path: "src/components/Form/ClaimReviewSelect.tsx#ClaimReviewSelect",
                            });
                } catch (__react_docgen_typescript_loader_error) {}
                react.createElement;
                var ClaimReviewSelect_stories = {
                        title: "Components/Inputs/ClaimReviewSelect",
                        component: Form_ClaimReviewSelect,
                        decorators: [
                            function (Story) {
                                return (0, jsx_runtime.jsx)("div", {
                                    style: { width: "500px" },
                                    children: (0, jsx_runtime.jsx)(Story, {}),
                                });
                            },
                        ],
                    },
                    Default = function Default(args) {
                        return (0, jsx_runtime.jsx)(Form_ClaimReviewSelect, {
                            type: "select",
                            onChange: void 0,
                            defaultValue: "",
                            placeholder: "placeholder",
                        });
                    };
                (Default.displayName = "Default"),
                    (Default.parameters = Object.assign(
                        {
                            storySource: {
                                source: '(args) => (\n    <ClaimReviewSelect\n        type="select"\n        onChange={undefined}\n        defaultValue=""\n        placeholder={\'placeholder\'}\n    />\n)',
                            },
                        },
                        Default.parameters
                    ));
                var ClaimReviewSelect_stories_namedExportsOrder = ["Default"];
            },
        "./src/stories/components/inputs/InputPassword.stories.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__),
                __webpack_require__.d(__webpack_exports__, {
                    Default: function () {
                        return Default;
                    },
                    __namedExportsOrder: function () {
                        return __namedExportsOrder;
                    },
                    default: function () {
                        return InputPassword_stories;
                    },
                });
            var react = __webpack_require__("./node_modules/react/index.js"),
                input =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/es.object.assign.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/input/style/index.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/input/index.js"
                    )),
                styled_components_browser_esm = __webpack_require__(
                    "./node_modules/styled-components/dist/styled-components.browser.esm.js"
                ),
                colors = __webpack_require__("./src/styles/colors.ts"),
                components_InputPassword = (0,
                styled_components_browser_esm.ZP)(input.Z.Password).withConfig({
                    displayName: "InputPassword",
                    componentId: "sc-dv4n16-0",
                })(
                    [
                        "background:",
                        ";box-shadow:0px 2px 2px rgba(0,0,0,0.25);border-radius:4px;border:none;height:40px;input{background:#f5f5f5;}::placeholder{color:#515151;}:focus{border:none;box-shadow:0px 2px 2px rgba(0,0,0,0.25);}:active{border:none;}:hover{border:none;}",
                    ],
                    function (props) {
                        return props.white
                            ? colors.Z.white
                            : colors.Z.lightGray;
                    }
                ),
                jsx_runtime = __webpack_require__(
                    "./node_modules/react/jsx-runtime.js"
                ),
                InputPassword_stories =
                    (react.createElement,
                    {
                        title: "Components/Inputs/Password",
                        component: components_InputPassword,
                        decorators: [
                            function (Story) {
                                return (0, jsx_runtime.jsx)("div", {
                                    style: { width: "500px" },
                                    children: (0, jsx_runtime.jsx)(Story, {}),
                                });
                            },
                        ],
                    }),
                Default = function Default() {
                    return (0, jsx_runtime.jsx)(components_InputPassword, {});
                };
            (Default.displayName = "Default"),
                (Default.parameters = Object.assign(
                    { storySource: { source: "() => (<InputPassword />)" } },
                    Default.parameters
                ));
            var __namedExportsOrder = ["Default"];
        },
        "./src/stories/components/inputs/InputSearch.stories.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__),
                __webpack_require__.d(__webpack_exports__, {
                    Default: function () {
                        return Default;
                    },
                    WithSuffix: function () {
                        return WithSuffix;
                    },
                    __namedExportsOrder: function () {
                        return __namedExportsOrder;
                    },
                });
            var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    "./node_modules/react/index.js"
                ),
                _ant_design_icons__WEBPACK_IMPORTED_MODULE_4__ =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/es.object.assign.js"
                    ),
                    __webpack_require__(
                        "./node_modules/@ant-design/icons/es/icons/SearchOutlined.js"
                    )),
                _components_Form_InputSearch__WEBPACK_IMPORTED_MODULE_2__ =
                    __webpack_require__(
                        "./src/components/Form/InputSearch.tsx"
                    ),
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ =
                    __webpack_require__("./node_modules/react/jsx-runtime.js");
            react__WEBPACK_IMPORTED_MODULE_0__.createElement;
            __webpack_exports__.default = {
                title: "Components/Inputs/InputSearch",
                component:
                    _components_Form_InputSearch__WEBPACK_IMPORTED_MODULE_2__.Z,
                callback: { action: "clicked" },
                args: { placeholder: "Search" },
                decorators: [
                    function (Story) {
                        return (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(
                            "div",
                            {
                                style: { width: "500px" },
                                children: (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(
                                    Story,
                                    {}
                                ),
                            }
                        );
                    },
                ],
            };
            var Template = function Template(args) {
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(
                    _components_Form_InputSearch__WEBPACK_IMPORTED_MODULE_2__.Z,
                    Object.assign({}, args)
                );
            };
            Template.displayName = "Template";
            var Default = Template.bind({}),
                WithSuffix = Template.bind({});
            (WithSuffix.args = {
                suffix: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(
                    _ant_design_icons__WEBPACK_IMPORTED_MODULE_4__.Z,
                    {}
                ),
            }),
                (Default.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => (\n    <InputSearch {...args} />\n)",
                        },
                    },
                    Default.parameters
                )),
                (WithSuffix.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => (\n    <InputSearch {...args} />\n)",
                        },
                    },
                    WithSuffix.parameters
                ));
            var __namedExportsOrder = ["Default", "WithSuffix"];
        },
        "./src/stories/components/inputs/SourceInput.stories.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__),
                __webpack_require__.d(__webpack_exports__, {
                    NoSources: function () {
                        return NoSources;
                    },
                    OneSource: function () {
                        return OneSource;
                    },
                    TwoSources: function () {
                        return TwoSources;
                    },
                    __namedExportsOrder: function () {
                        return __namedExportsOrder;
                    },
                    default: function () {
                        return SourceInput_stories;
                    },
                });
            var react = __webpack_require__("./node_modules/react/index.js"),
                lib_form =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/es.object.assign.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/form/style/index.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/form/index.js"
                    )),
                row =
                    (__webpack_require__(
                        "./node_modules/antd/lib/row/style/index.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/row/index.js"
                    )),
                col =
                    (__webpack_require__(
                        "./node_modules/antd/lib/col/style/index.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/col/index.js"
                    )),
                DeleteOutlined =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/es.array.map.js"
                    ),
                    __webpack_require__(
                        "./node_modules/@ant-design/icons/es/icons/DeleteOutlined.js"
                    )),
                PlusOutlined = __webpack_require__(
                    "./node_modules/@ant-design/icons/es/icons/PlusOutlined.js"
                ),
                useTranslation = __webpack_require__(
                    "./node_modules/react-i18next/dist/es/useTranslation.js"
                ),
                AletheiaInput = __webpack_require__(
                    "./src/components/AletheiaInput.tsx"
                ),
                Button = __webpack_require__("./src/components/Button.tsx"),
                jsx_runtime = __webpack_require__(
                    "./node_modules/react/jsx-runtime.js"
                ),
                SourceInput =
                    (react.createElement,
                    function SourceInput(_ref) {
                        var onChange = _ref.onChange,
                            addSource = _ref.addSource,
                            removeSource = _ref.removeSource,
                            placeholder = _ref.placeholder,
                            label = (_ref.name, _ref.label),
                            sources = _ref.sources,
                            t = (0, useTranslation.$)().t;
                        return (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                            children: [
                                sources &&
                                    sources.map(function (source, index) {
                                        return (0, jsx_runtime.jsx)(
                                            lib_form.Z.Item,
                                            {
                                                name: "source-" + index,
                                                label:
                                                    0 === index ? label : null,
                                                extra:
                                                    index === sources.length - 1
                                                        ? t("sourceForm:extra")
                                                        : null,
                                                rules: [
                                                    {
                                                        message: t(
                                                            "sourceForm:errorMessageValidURL"
                                                        ),
                                                        type: "url",
                                                    },
                                                    {
                                                        required: !0,
                                                        message: t(
                                                            "common:requiredFieldError"
                                                        ),
                                                    },
                                                ],
                                                children: (0, jsx_runtime.jsxs)(
                                                    row.Z,
                                                    {
                                                        children: [
                                                            (0,
                                                            jsx_runtime.jsx)(
                                                                col.Z,
                                                                {
                                                                    span:
                                                                        index >
                                                                        0
                                                                            ? 20
                                                                            : 24,
                                                                    children:
                                                                        (0,
                                                                        jsx_runtime.jsx)(
                                                                            AletheiaInput.Z,
                                                                            {
                                                                                value:
                                                                                    source ||
                                                                                    "",
                                                                                onChange:
                                                                                    function onSourceChange(
                                                                                        e
                                                                                    ) {
                                                                                        onChange(
                                                                                            e,
                                                                                            index
                                                                                        );
                                                                                    },
                                                                                placeholder:
                                                                                    placeholder,
                                                                                "data-cy":
                                                                                    "testSource1",
                                                                            },
                                                                            index
                                                                        ),
                                                                }
                                                            ),
                                                            (0,
                                                            jsx_runtime.jsx)(
                                                                col.Z,
                                                                {
                                                                    span: 4,
                                                                    children:
                                                                        index >
                                                                            0 &&
                                                                        (0,
                                                                        jsx_runtime.jsx)(
                                                                            Button.Z,
                                                                            {
                                                                                style: {
                                                                                    width: "100%",
                                                                                    height: "40px",
                                                                                },
                                                                                onClick:
                                                                                    function onClick() {
                                                                                        return removeSource(
                                                                                            index
                                                                                        );
                                                                                    },
                                                                                children:
                                                                                    (0,
                                                                                    jsx_runtime.jsx)(
                                                                                        DeleteOutlined.Z,
                                                                                        {}
                                                                                    ),
                                                                            }
                                                                        ),
                                                                }
                                                            ),
                                                        ],
                                                    }
                                                ),
                                            },
                                            index
                                        );
                                    }),
                                (0, jsx_runtime.jsx)("div", {
                                    style: {
                                        width: "100%",
                                        textAlign: "right",
                                        paddingBottom: "15px",
                                    },
                                    children: (0, jsx_runtime.jsxs)("a", {
                                        onClick: addSource,
                                        style: { textDecoration: "underline" },
                                        children: [
                                            (0, jsx_runtime.jsx)(
                                                PlusOutlined.Z,
                                                {}
                                            ),
                                            " ",
                                            t("sourceForm:addNewSourceButton"),
                                        ],
                                    }),
                                }),
                            ],
                        });
                    }),
                Source_SourceInput = SourceInput;
            try {
                (SourceInput.displayName = "SourceInput"),
                    (SourceInput.__docgenInfo = {
                        description: "",
                        displayName: "SourceInput",
                        props: {
                            onChange: {
                                defaultValue: null,
                                description: "",
                                name: "onChange",
                                required: !0,
                                type: { name: "any" },
                            },
                            addSource: {
                                defaultValue: null,
                                description: "",
                                name: "addSource",
                                required: !0,
                                type: { name: "any" },
                            },
                            removeSource: {
                                defaultValue: null,
                                description: "",
                                name: "removeSource",
                                required: !0,
                                type: { name: "any" },
                            },
                            placeholder: {
                                defaultValue: null,
                                description: "",
                                name: "placeholder",
                                required: !0,
                                type: { name: "any" },
                            },
                            name: {
                                defaultValue: null,
                                description: "",
                                name: "name",
                                required: !0,
                                type: { name: "any" },
                            },
                            label: {
                                defaultValue: null,
                                description: "",
                                name: "label",
                                required: !0,
                                type: { name: "any" },
                            },
                            sources: {
                                defaultValue: null,
                                description: "",
                                name: "sources",
                                required: !0,
                                type: { name: "any" },
                            },
                        },
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/Source/SourceInput.tsx#SourceInput"
                        ] = {
                            docgenInfo: SourceInput.__docgenInfo,
                            name: "SourceInput",
                            path: "src/components/Source/SourceInput.tsx#SourceInput",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
            react.createElement;
            var SourceInput_stories = {
                    title: "Components/Inputs/SourceInput",
                    component: Source_SourceInput,
                    args: {
                        placeholder: "Placeholder",
                        name: "name",
                        label: "Label",
                        sources: [""],
                    },
                    argTypes: { numOfSources: { control: "number" } },
                },
                Template = function Template(args) {
                    var sources = [];
                    if (args.numOfSources <= 0) sources = [""];
                    else
                        for (var i = 0; i < args.numOfSources; i++)
                            sources.push("https://www.google.com/");
                    return (0, jsx_runtime.jsx)(
                        Source_SourceInput,
                        Object.assign({}, args, { sources: sources })
                    );
                };
            Template.displayName = "Template";
            var NoSources = Template.bind({});
            NoSources.args = { numOfSources: 0 };
            var OneSource = Template.bind({});
            OneSource.args = { numOfSources: 1 };
            var TwoSources = Template.bind({});
            (TwoSources.args = { numOfSources: 2 }),
                (NoSources.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => {\n    let sources = [];\n    if (args.numOfSources <= 0) {\n        sources = ['']\n    }\n    else {\n        for (let i = 0; i < args.numOfSources; i++) {\n            sources.push('https://www.google.com/');\n        }\n    }\n    return (<SourceInput {...args} sources={sources} />\n    );\n}",
                        },
                    },
                    NoSources.parameters
                )),
                (OneSource.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => {\n    let sources = [];\n    if (args.numOfSources <= 0) {\n        sources = ['']\n    }\n    else {\n        for (let i = 0; i < args.numOfSources; i++) {\n            sources.push('https://www.google.com/');\n        }\n    }\n    return (<SourceInput {...args} sources={sources} />\n    );\n}",
                        },
                    },
                    OneSource.parameters
                )),
                (TwoSources.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => {\n    let sources = [];\n    if (args.numOfSources <= 0) {\n        sources = ['']\n    }\n    else {\n        for (let i = 0; i < args.numOfSources; i++) {\n            sources.push('https://www.google.com/');\n        }\n    }\n    return (<SourceInput {...args} sources={sources} />\n    );\n}",
                        },
                    },
                    TwoSources.parameters
                ));
            var __namedExportsOrder = ["NoSources", "OneSource", "TwoSources"];
        },
        "./src/stories/components/inputs/TextArea.stories.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__),
                __webpack_require__.d(__webpack_exports__, {
                    Default: function () {
                        return Default;
                    },
                    __namedExportsOrder: function () {
                        return __namedExportsOrder;
                    },
                    default: function () {
                        return TextArea_stories;
                    },
                });
            var react = __webpack_require__("./node_modules/react/index.js"),
                input =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/es.object.assign.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/input/style/index.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/input/index.js"
                    )),
                styled_components_browser_esm = __webpack_require__(
                    "./node_modules/styled-components/dist/styled-components.browser.esm.js"
                ),
                colors = __webpack_require__("./src/styles/colors.ts"),
                components_TextArea = (0, styled_components_browser_esm.ZP)(
                    input.Z.TextArea
                ).withConfig({
                    displayName: "TextArea",
                    componentId: "sc-1m9j3cy-0",
                })(
                    [
                        "background:",
                        ";box-shadow:0px 2px 2px rgba(0,0,0,0.25);border-radius:4px;border:none;height:40px;padding:10px;::placeholder{color:",
                        ";}:focus{border:none;box-shadow:0px 2px 2px rgba(0,0,0,0.25);}:active{border:none;}:hover{border:none;}",
                    ],
                    function (props) {
                        return props.white
                            ? colors.Z.white
                            : colors.Z.lightGray;
                    },
                    colors.Z.blackSecondary
                ),
                jsx_runtime = __webpack_require__(
                    "./node_modules/react/jsx-runtime.js"
                ),
                TextArea_stories =
                    (react.createElement,
                    {
                        title: "Components/Inputs/TextArea",
                        component: components_TextArea,
                        decorators: [
                            function (Story) {
                                return (0, jsx_runtime.jsx)("div", {
                                    style: { width: "500px" },
                                    children: (0, jsx_runtime.jsx)(Story, {}),
                                });
                            },
                        ],
                    }),
                Template = function Template(args) {
                    return (0, jsx_runtime.jsx)(
                        components_TextArea,
                        Object.assign({}, args)
                    );
                };
            Template.displayName = "Template";
            var Default = Template.bind({});
            (Default.args = {
                rows: 4,
                placeholder: "Placeholder",
                value: "Value",
            }),
                (Default.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => (<TextArea  {...args} />)",
                        },
                    },
                    Default.parameters
                ));
            var __namedExportsOrder = ["Default"];
        },
        "./src/stories/components/layout/AletheiaMenu.stories.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__),
                __webpack_require__.d(__webpack_exports__, {
                    Default: function () {
                        return Default;
                    },
                    __namedExportsOrder: function () {
                        return __namedExportsOrder;
                    },
                });
            var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    "./node_modules/react/index.js"
                ),
                _components_AletheiaMenu__WEBPACK_IMPORTED_MODULE_2__ =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/es.object.assign.js"
                    ),
                    __webpack_require__("./src/components/AletheiaMenu.tsx")),
                _ProviderWrapper__WEBPACK_IMPORTED_MODULE_3__ =
                    __webpack_require__("./src/stories/ProviderWrapper.tsx"),
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ =
                    __webpack_require__("./node_modules/react/jsx-runtime.js");
            react__WEBPACK_IMPORTED_MODULE_0__.createElement;
            __webpack_exports__.default = {
                title: "Components/Layout/Menu",
                component:
                    _components_AletheiaMenu__WEBPACK_IMPORTED_MODULE_2__.Z,
                decorators: [
                    function (Story) {
                        return (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(
                            _ProviderWrapper__WEBPACK_IMPORTED_MODULE_3__.Z,
                            {
                                children: (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(
                                    Story,
                                    {}
                                ),
                            }
                        );
                    },
                ],
            };
            var Template = function Template() {
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(
                    _components_AletheiaMenu__WEBPACK_IMPORTED_MODULE_2__.Z,
                    {}
                );
            };
            Template.displayName = "Template";
            var Default = Template.bind({});
            Default.parameters = Object.assign(
                { storySource: { source: "() => (<AletheiaMenu />)" } },
                Default.parameters
            );
            var __namedExportsOrder = ["Default"];
        },
        "./src/stories/components/layout/AletheiaSocialMediaFooter.stories.tsx":
            function (
                __unused_webpack_module,
                __webpack_exports__,
                __webpack_require__
            ) {
                "use strict";
                __webpack_require__.r(__webpack_exports__),
                    __webpack_require__.d(__webpack_exports__, {
                        Default: function () {
                            return Default;
                        },
                        __namedExportsOrder: function () {
                            return __namedExportsOrder;
                        },
                        default: function () {
                            return AletheiaSocialMediaFooter_stories;
                        },
                    });
                var react = __webpack_require__(
                        "./node_modules/react/index.js"
                    ),
                    row =
                        (__webpack_require__(
                            "./node_modules/core-js/modules/es.object.assign.js"
                        ),
                        __webpack_require__(
                            "./node_modules/antd/lib/row/style/index.js"
                        ),
                        __webpack_require__(
                            "./node_modules/antd/lib/row/index.js"
                        )),
                    divider =
                        (__webpack_require__(
                            "./node_modules/antd/lib/divider/style/index.js"
                        ),
                        __webpack_require__(
                            "./node_modules/antd/lib/divider/index.js"
                        )),
                    col =
                        (__webpack_require__(
                            "./node_modules/antd/lib/col/style/index.js"
                        ),
                        __webpack_require__(
                            "./node_modules/antd/lib/col/index.js"
                        )),
                    useTranslation = __webpack_require__(
                        "./node_modules/react-i18next/dist/es/useTranslation.js"
                    ),
                    react_social_icons = __webpack_require__(
                        "./node_modules/react-social-icons/build/react-social-icons.js"
                    ),
                    colors = __webpack_require__("./src/styles/colors.ts"),
                    jsx_runtime = __webpack_require__(
                        "./node_modules/react/jsx-runtime.js"
                    ),
                    AletheiaSocialMediaFooter =
                        (react.createElement,
                        function AletheiaSocialMediaFooter() {
                            var t = (0, useTranslation.$)().t;
                            return (0, jsx_runtime.jsxs)(row.Z, {
                                justify: "center",
                                style: { padding: "10px 0" },
                                children: [
                                    (0, jsx_runtime.jsx)(col.Z, {
                                        span: 24,
                                        children: (0, jsx_runtime.jsx)("h3", {
                                            style: {
                                                fontSize: "23px",
                                                color: colors.Z.white,
                                            },
                                            children: t("footer:socialMedia"),
                                        }),
                                    }),
                                    (0, jsx_runtime.jsxs)(col.Z, {
                                        span: 24,
                                        children: [
                                            (0, jsx_runtime.jsx)(
                                                react_social_icons.QZ,
                                                {
                                                    url: "https://www.instagram.com/aletheiafact",
                                                    bgColor:
                                                        colors.Z.bluePrimary,
                                                    target: "_blank",
                                                    rel: "noreferrer",
                                                    fgColor: "white",
                                                }
                                            ),
                                            (0, jsx_runtime.jsx)(
                                                react_social_icons.QZ,
                                                {
                                                    url: "https://www.facebook.com/AletheiaFactorg-107521791638412",
                                                    bgColor:
                                                        colors.Z.bluePrimary,
                                                    target: "_blank",
                                                    rel: "noreferrer",
                                                    fgColor: "white",
                                                }
                                            ),
                                            (0, jsx_runtime.jsx)(
                                                react_social_icons.QZ,
                                                {
                                                    url: "https://www.linkedin.com/company/aletheiafact-org",
                                                    bgColor:
                                                        colors.Z.bluePrimary,
                                                    target: "_blank",
                                                    rel: "noreferrer",
                                                    fgColor: "white",
                                                }
                                            ),
                                            (0, jsx_runtime.jsx)(
                                                react_social_icons.QZ,
                                                {
                                                    url: "https://github.com/AletheiaFact/aletheia",
                                                    bgColor:
                                                        colors.Z.bluePrimary,
                                                    target: "_blank",
                                                    rel: "noreferrer",
                                                    fgColor: "white",
                                                }
                                            ),
                                        ],
                                    }),
                                    (0, jsx_runtime.jsx)(col.Z, {
                                        style: {
                                            width: "324px",
                                            margin: "10px auto",
                                        },
                                        children: (0, jsx_runtime.jsx)(
                                            divider.Z,
                                            {
                                                style: {
                                                    backgroundColor:
                                                        colors.Z.white,
                                                },
                                            }
                                        ),
                                    }),
                                ],
                            });
                        });
                AletheiaSocialMediaFooter.displayName =
                    "AletheiaSocialMediaFooter";
                var Footer_AletheiaSocialMediaFooter =
                        AletheiaSocialMediaFooter,
                    AletheiaSocialMediaFooter_stories =
                        (react.createElement,
                        {
                            title: "Components/Layout/AletheiaSocialMediaFooter",
                            component: Footer_AletheiaSocialMediaFooter,
                            parameters: { backgrounds: { default: "blue" } },
                        }),
                    Default = function Default() {
                        return (0, jsx_runtime.jsx)(
                            Footer_AletheiaSocialMediaFooter,
                            {}
                        );
                    };
                (Default.displayName = "Default"),
                    (Default.parameters = Object.assign(
                        {
                            storySource: {
                                source: "() => <AletheiaSocialMediaFooter />",
                            },
                        },
                        Default.parameters
                    ));
                var __namedExportsOrder = ["Default"];
            },
        "./src/stories/components/layout/CardBase.stories.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__),
                __webpack_require__.d(__webpack_exports__, {
                    Default: function () {
                        return Default;
                    },
                    __namedExportsOrder: function () {
                        return __namedExportsOrder;
                    },
                });
            var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    "./node_modules/react/index.js"
                ),
                _components_CardBase__WEBPACK_IMPORTED_MODULE_2__ =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/es.object.assign.js"
                    ),
                    __webpack_require__("./src/components/CardBase.tsx")),
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ =
                    __webpack_require__("./node_modules/react/jsx-runtime.js");
            react__WEBPACK_IMPORTED_MODULE_0__.createElement;
            __webpack_exports__.default = {
                title: "Components/Layout/CardBase",
                component: _components_CardBase__WEBPACK_IMPORTED_MODULE_2__.Z,
                decorators: [
                    function (Story) {
                        return (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(
                            "div",
                            {
                                style: { width: "500px" },
                                children: (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(
                                    Story,
                                    {}
                                ),
                            }
                        );
                    },
                ],
            };
            var Template = function Template(args) {
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(
                    _components_CardBase__WEBPACK_IMPORTED_MODULE_2__.Z,
                    { children: args.children }
                );
            };
            Template.displayName = "Template";
            var Default = Template.bind({});
            (Default.args = { children: "CardBase simple text content" }),
                (Default.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => (<CardBase>\n    {args.children}\n</CardBase>)",
                        },
                    },
                    Default.parameters
                ));
            var __namedExportsOrder = ["Default"];
        },
        "./src/stories/components/layout/HeaderContent.stories.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__),
                __webpack_require__.d(__webpack_exports__, {
                    Default: function () {
                        return Default;
                    },
                    __namedExportsOrder: function () {
                        return HeaderContent_stories_namedExportsOrder;
                    },
                    default: function () {
                        return HeaderContent_stories;
                    },
                });
            var react = __webpack_require__("./node_modules/react/index.js"),
                SearchOutlined =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/es.object.assign.js"
                    ),
                    __webpack_require__(
                        "./node_modules/@ant-design/icons/es/icons/SearchOutlined.js"
                    )),
                es = __webpack_require__(
                    "./node_modules/react-redux/es/index.js"
                ),
                actions = __webpack_require__("./src/store/actions.ts"),
                store = __webpack_require__("./src/store/store.ts"),
                Button = __webpack_require__("./src/components/Button.tsx"),
                col =
                    (__webpack_require__(
                        "./node_modules/antd/lib/col/style/index.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/col/index.js"
                    )),
                LeftCircleFilled =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/es.string.search.js"
                    ),
                    __webpack_require__(
                        "./node_modules/core-js/modules/es.regexp.exec.js"
                    ),
                    __webpack_require__(
                        "./node_modules/@ant-design/icons/es/icons/LeftCircleFilled.js"
                    )),
                styled_components_browser_esm = __webpack_require__(
                    "./node_modules/styled-components/dist/styled-components.browser.esm.js"
                ),
                colors = __webpack_require__("./src/styles/colors.ts"),
                mediaQueries = __webpack_require__(
                    "./src/styles/mediaQueries.ts"
                ),
                OverlaySearchInput = __webpack_require__(
                    "./src/components/Search/OverlaySearchInput.tsx"
                ),
                jsx_runtime = __webpack_require__(
                    "./node_modules/react/jsx-runtime.js"
                ),
                OverlayCol =
                    (react.createElement,
                    (0, styled_components_browser_esm.ZP)(col.Z).withConfig({
                        displayName: "SearchOverlay__OverlayCol",
                        componentId: "sc-155lehe-0",
                    })(
                        [
                            ".ant-input-lg{font-weight:600;}.ant-input::placeholder{font-style:italic;font-weight:300;font-size:14px;line-height:20px;color:",
                            ";}.input-container{width:100%;display:flex;align-items:center;max-width:320px;padding-left:15px;.ant-input-affix-wrapper{height:32px;}@media ",
                            "{display:none;max-width:100vw;height:56px;}}.overlay{background-color:",
                            ";position:fixed;z-index:3;width:100vw;left:0;top:0;display:flex;padding-right:15px;}",
                        ],
                        colors.Z.blackSecondary,
                        mediaQueries.o$.xs,
                        colors.Z.bluePrimary
                    )),
                SearchOverlay = function SearchOverlay() {
                    var dispatch = (0, es.I0)(),
                        _useAppSelector = (0, store.CG)(function (state) {
                            var _state$search;
                            return {
                                vw: state.vw,
                                isOpen:
                                    (null == state ||
                                    null === (_state$search = state.search) ||
                                    void 0 === _state$search
                                        ? void 0
                                        : _state$search.overlayVisible) || !1,
                            };
                        }),
                        vw = _useAppSelector.vw,
                        isOpen = _useAppSelector.isOpen;
                    return (
                        console.log(isOpen || !(null != vw && vw.xs)),
                        (0, jsx_runtime.jsx)(OverlayCol, {
                            xs: 1,
                            sm: 10,
                            md: 10,
                            children: (0, jsx_runtime.jsxs)("div", {
                                className:
                                    "input-container " +
                                    (null != vw && vw.xs && isOpen
                                        ? "overlay"
                                        : ""),
                                children: [
                                    (null == vw ? void 0 : vw.xs) &&
                                        isOpen &&
                                        (0, jsx_runtime.jsx)(Button.Z, {
                                            onClick: function onClick() {
                                                dispatch(
                                                    actions.Z.closeResultsOverlay()
                                                );
                                            },
                                            children: (0, jsx_runtime.jsx)(
                                                LeftCircleFilled.Z,
                                                { style: { fontSize: "24px" } }
                                            ),
                                        }),
                                    (isOpen || !(null != vw && vw.xs)) &&
                                        (0, jsx_runtime.jsx)(
                                            OverlaySearchInput.Z,
                                            {}
                                        ),
                                ],
                            }),
                        })
                    );
                };
            SearchOverlay.displayName = "SearchOverlay";
            var Search_SearchOverlay = SearchOverlay,
                HeaderActions_style = (0, styled_components_browser_esm.ZP)(
                    col.Z
                ).withConfig({
                    displayName: "HeaderActionsstyle__HeaderActionsStyle",
                    componentId: "sc-1wmdnrf-0",
                })(
                    [
                        "display:flex;align-items:flex-end;justify-content:space-evenly;align-items:center;@media ",
                        "{padding:0 1vw;button{padding:0 1vw;}}",
                    ],
                    mediaQueries.o$.sm
                ),
                Logo = __webpack_require__("./src/components/Header/Logo.tsx"),
                lib_switch =
                    (__webpack_require__(
                        "./node_modules/antd/lib/switch/style/index.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/switch/index.js"
                    )),
                lib_select =
                    (__webpack_require__(
                        "./node_modules/antd/lib/select/style/index.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/select/index.js"
                    )),
                _3x2 =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/es.array.includes.js"
                    ),
                    __webpack_require__(
                        "./node_modules/core-js/modules/es.string.includes.js"
                    ),
                    __webpack_require__(
                        "./node_modules/country-flag-icons/modules/react/3x2/index.js"
                    )),
                js_cookie = __webpack_require__(
                    "./node_modules/js-cookie/dist/js.cookie.mjs"
                ),
                Option = (react.createElement, lib_select.Z.Option),
                SelectInput = (0, styled_components_browser_esm.ZP)(
                    lib_select.Z
                ).withConfig({
                    displayName: "SelectLanguage__SelectInput",
                    componentId: "sc-1yolqk4-0",
                })(
                    [
                        "background-color:none;.ant-select-arrow{color:",
                        ";font-size:0.8rem;}",
                    ],
                    colors.Z.white
                ),
                SwitchInputStyle = (0, styled_components_browser_esm.ZP)(
                    lib_switch.Z
                ).withConfig({
                    displayName: "SelectLanguage__SwitchInputStyle",
                    componentId: "sc-1yolqk4-1",
                })(["background-color:", ";"], colors.Z.bluePrimary),
                SelectLanguage = function SelectLanguage(props) {
                    var vw = (0, store.CG)(function (state) {
                            return state;
                        }).vw,
                        _useState = (0, react.useState)(!1),
                        switchLoading = _useState[0],
                        setSwitchLoading = _useState[1],
                        language =
                            js_cookie.Z.get("default_language") ||
                            props.defaultLanguage,
                        setDefaultLanguage = function setDefaultLanguage(
                            language
                        ) {
                            document.cookie.includes(
                                "default_language=" + language
                            ) || window.location.reload(),
                                (document.cookie =
                                    "default_language=" + language);
                        };
                    return (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                        children: [
                            !(null != vw && vw.sm) &&
                                (0, jsx_runtime.jsxs)(SelectInput, {
                                    style: { paddingTop: 6 },
                                    bordered: !1,
                                    showArrow: !0,
                                    value: language,
                                    onSelect: setDefaultLanguage,
                                    "data-cy": props.dataCy,
                                    children: [
                                        (0, jsx_runtime.jsx)(Option, {
                                            value: "pt",
                                            "data-cy": "testLanguagePt",
                                            children: (0, jsx_runtime.jsx)(
                                                _3x2.BR,
                                                {
                                                    title: "BR",
                                                    style: { width: "20px" },
                                                }
                                            ),
                                        }),
                                        (0, jsx_runtime.jsx)(Option, {
                                            value: "en",
                                            "data-cy": "testLanguageEn",
                                            children: (0, jsx_runtime.jsx)(
                                                _3x2.GB,
                                                {
                                                    title: "EN",
                                                    style: { width: "20px" },
                                                }
                                            ),
                                        }),
                                    ],
                                }),
                            (null == vw ? void 0 : vw.sm) &&
                                (0, jsx_runtime.jsxs)("div", {
                                    style: {
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        gap: 4,
                                        alignItems: "center",
                                    },
                                    children: [
                                        (0, jsx_runtime.jsx)("span", {
                                            style: { fontSize: 10 },
                                            children:
                                                "pt" === language ? "BR" : "EN",
                                        }),
                                        (0, jsx_runtime.jsx)(SwitchInputStyle, {
                                            checkedChildren: (0,
                                            jsx_runtime.jsx)(_3x2.BR, {
                                                title: "BR",
                                            }),
                                            unCheckedChildren: (0,
                                            jsx_runtime.jsx)(_3x2.GB, {
                                                title: "EN",
                                            }),
                                            defaultChecked: "pt" === language,
                                            onChange: function onChangeSwitch(
                                                checked
                                            ) {
                                                var language = checked
                                                    ? "pt"
                                                    : "en";
                                                setSwitchLoading(function (
                                                    state
                                                ) {
                                                    return !state;
                                                }),
                                                    setDefaultLanguage(
                                                        language
                                                    );
                                            },
                                            loading: switchLoading,
                                        }),
                                    ],
                                }),
                        ],
                    });
                },
                Header_SelectLanguage = SelectLanguage;
            try {
                (SelectLanguage.displayName = "SelectLanguage"),
                    (SelectLanguage.__docgenInfo = {
                        description: "",
                        displayName: "SelectLanguage",
                        props: {
                            defaultLanguage: {
                                defaultValue: null,
                                description: "",
                                name: "defaultLanguage",
                                required: !0,
                                type: { name: "any" },
                            },
                            dataCy: {
                                defaultValue: null,
                                description: "",
                                name: "dataCy",
                                required: !0,
                                type: { name: "any" },
                            },
                        },
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/Header/SelectLanguage.tsx#SelectLanguage"
                        ] = {
                            docgenInfo: SelectLanguage.__docgenInfo,
                            name: "SelectLanguage",
                            path: "src/components/Header/SelectLanguage.tsx#SelectLanguage",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
            __webpack_require__(
                "./node_modules/antd/lib/dropdown/style/index.js"
            );
            var dropdown = __webpack_require__(
                    "./node_modules/antd/lib/dropdown/index.js"
                ),
                lib_menu =
                    (__webpack_require__(
                        "./node_modules/antd/lib/menu/style/index.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/menu/index.js"
                    )),
                useTranslation = __webpack_require__(
                    "./node_modules/react-i18next/dist/es/useTranslation.js"
                ),
                next_router = __webpack_require__(
                    "./node_modules/next/router.js"
                ),
                dist = __webpack_require__(
                    "./node_modules/@ory/client/dist/index.js"
                ),
                next = __webpack_require__(
                    "./node_modules/@ory/integrations/next/index.mjs"
                ),
                ory = new dist.V0alpha2Api(new dist.Configuration(next.Q)),
                asyncToGenerator = __webpack_require__(
                    "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js"
                ),
                regenerator = __webpack_require__(
                    "./node_modules/@babel/runtime/regenerator/index.js"
                ),
                regenerator_default = __webpack_require__.n(regenerator);
            __webpack_require__("./node_modules/core-js/modules/es.promise.js"),
                __webpack_require__(
                    "./node_modules/core-js/modules/es.object.to-string.js"
                );
            function _CreateLogoutHandler() {
                return (_CreateLogoutHandler = (0, asyncToGenerator.Z)(
                    regenerator_default().mark(function _callee() {
                        var _yield$ory$createSelf, data;
                        return regenerator_default().wrap(function _callee$(
                            _context
                        ) {
                            for (;;)
                                switch ((_context.prev = _context.next)) {
                                    case 0:
                                        return (
                                            (_context.next = 2),
                                            ory.createSelfServiceLogoutFlowUrlForBrowsers()
                                        );
                                    case 2:
                                        return (
                                            (_yield$ory$createSelf =
                                                _context.sent),
                                            (data = _yield$ory$createSelf.data),
                                            (_context.next = 6),
                                            ory.submitSelfServiceLogoutFlow(
                                                data.logout_token
                                            )
                                        );
                                    case 6:
                                    case "end":
                                        return _context.stop();
                                }
                        },
                        _callee);
                    })
                )).apply(this, arguments);
            }
            react.createElement;
            var UserIcon = function UserIcon(props) {
                var size = props.size;
                return (0, jsx_runtime.jsx)(
                    "svg",
                    Object.assign(
                        {
                            width: size,
                            height: size,
                            fill: "none",
                            xmlns: "http://www.w3.org/2000/svg",
                        },
                        props,
                        {
                            children: (0, jsx_runtime.jsx)("path", {
                                fillRule: "evenodd",
                                clipRule: "evenodd",
                                d: "M8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Zm12 10.063C18.046 15.57 15.186 15 12 15s-6.045.571-8 3.063V20h16v-1.938Z",
                                fill: "#fff",
                            }),
                        }
                    )
                );
            };
            UserIcon.displayName = "UserIcon";
            var Header_UserIcon = UserIcon;
            try {
                (UserIcon.displayName = "UserIcon"),
                    (UserIcon.__docgenInfo = {
                        description: "",
                        displayName: "UserIcon",
                        props: {},
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/Header/UserIcon.tsx#UserIcon"
                        ] = {
                            docgenInfo: UserIcon.__docgenInfo,
                            name: "UserIcon",
                            path: "src/components/Header/UserIcon.tsx#UserIcon",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
            react.createElement;
            var UserMenu = function UserMenu() {
                var vw = (0, store.CG)(function (state) {
                        return state;
                    }).vw,
                    _useState = (0, react.useState)(!1),
                    hasSession = _useState[0],
                    setHasSession = _useState[1],
                    _useState2 = (0, react.useState)(!1),
                    isLoading = _useState2[0],
                    setIsLoading = _useState2[1],
                    t = (0, useTranslation.$)().t,
                    router = (0, next_router.useRouter)();
                (0, react.useEffect)(function () {
                    ory.toSession()
                        .then(function () {
                            setHasSession(!0);
                        })
                        .catch(function () {
                            setHasSession(!1);
                        });
                }, []);
                var menu = (0, jsx_runtime.jsxs)(lib_menu.Z, {
                    children: [
                        (0, jsx_runtime.jsx)(
                            lib_menu.Z.Item,
                            {
                                "data-cy":
                                    "test" +
                                    (hasSession ? "MyAccount" : "Login") +
                                    "Item",
                                style: { fontSize: "18px" },
                                onClick: function loginOrProfile() {
                                    router.push(
                                        hasSession ? "profile" : "login"
                                    );
                                },
                                children: t(
                                    "menu:" +
                                        (hasSession ? "myAccount" : "login") +
                                        "Item"
                                ),
                            },
                            "/profile"
                        ),
                        hasSession
                            ? (0, jsx_runtime.jsx)(
                                  lib_menu.Z.Item,
                                  {
                                      "data-cy": "testLogout",
                                      disabled: isLoading,
                                      style: { fontSize: "18px" },
                                      onClick: function onLogout() {
                                          isLoading ||
                                              (setIsLoading(!0),
                                              (function CreateLogoutHandler() {
                                                  return _CreateLogoutHandler.apply(
                                                      this,
                                                      arguments
                                                  );
                                              })().then(function () {
                                                  return router.reload();
                                              }));
                                      },
                                      children: t("menu:logout"),
                                  },
                                  "/home"
                              )
                            : (0, jsx_runtime.jsx)(
                                  lib_menu.Z.Item,
                                  {
                                      "data-cy": "testRegister",
                                      disabled: isLoading,
                                      style: { fontSize: "18px" },
                                      onClick: function onSignUp() {
                                          router.push("sign-up");
                                      },
                                      children: t("login:signup"),
                                  },
                                  "/sign-up"
                              ),
                        (null == vw ? void 0 : vw.sm) &&
                            (0, jsx_runtime.jsx)(
                                lib_menu.Z.Item,
                                {
                                    "data-cy": "testLanguages",
                                    children: (0, jsx_runtime.jsx)(
                                        Header_SelectLanguage,
                                        {
                                            dataCy: "LanguageButton",
                                            defaultLanguage: "pt",
                                        }
                                    ),
                                },
                                "/language"
                            ),
                    ],
                });
                return (0, jsx_runtime.jsx)(dropdown.Z, {
                    overlay: menu,
                    children: (0, jsx_runtime.jsx)(Button.Z, {
                        style: { paddingBottom: "4px" },
                        "data-cy": "testUserIcon",
                        children: (0, jsx_runtime.jsx)(Header_UserIcon, {
                            size: "20px",
                        }),
                    }),
                });
            };
            UserMenu.displayName = "UserMenu";
            var Header_UserMenu = UserMenu,
                umami = __webpack_require__("./src/lib/umami.ts"),
                DonateButton =
                    (react.createElement,
                    function DonateButton(_ref) {
                        var _ref$header = _ref.header,
                            header = void 0 !== _ref$header && _ref$header,
                            _ref$style = _ref.style,
                            style = void 0 === _ref$style ? {} : _ref$style,
                            t = (0, useTranslation.$)().t;
                        return (0, jsx_runtime.jsx)(Button.Z, {
                            type: Button.L.white,
                            href: "https://donate.aletheiafact.org/",
                            target: "_blank",
                            rel: "noreferrer",
                            onClick: function onClick() {
                                (0, umami.dJ)(
                                    "header-cta-donate-button",
                                    "Donate"
                                );
                            },
                            style: Object.assign(
                                {
                                    fontWeight: 600,
                                    height: header ? 32 : 40,
                                    minWidth: "75px",
                                },
                                style
                            ),
                            children: t(
                                header
                                    ? "header:donateButton"
                                    : "home:donateButton"
                            ),
                        });
                    });
            DonateButton.displayName = "DonateButton";
            var Header_DonateButton = DonateButton;
            try {
                (DonateButton.displayName = "DonateButton"),
                    (DonateButton.__docgenInfo = {
                        description: "",
                        displayName: "DonateButton",
                        props: {
                            header: {
                                defaultValue: { value: "false" },
                                description: "",
                                name: "header",
                                required: !1,
                                type: { name: "boolean" },
                            },
                            style: {
                                defaultValue: { value: "{}" },
                                description: "",
                                name: "style",
                                required: !1,
                                type: { name: "{}" },
                            },
                        },
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/Header/DonateButton.tsx#DonateButton"
                        ] = {
                            docgenInfo: DonateButton.__docgenInfo,
                            name: "DonateButton",
                            path: "src/components/Header/DonateButton.tsx#DonateButton",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
            var MenuOutlined = __webpack_require__(
                    "./node_modules/@ant-design/icons/es/icons/MenuOutlined.js"
                ),
                Menu =
                    (react.createElement,
                    function Menu() {
                        var dispatch = (0, es.I0)();
                        return (0, jsx_runtime.jsx)(Button.Z, {
                            "data-cy": "testOpenSideMenu",
                            onClick: function onClick() {
                                dispatch(actions.Z.openSideMenu());
                            },
                            children: (0, jsx_runtime.jsx)(MenuOutlined.Z, {
                                style: {
                                    fontSize: "16px",
                                    color: colors.Z.white,
                                },
                            }),
                        });
                    });
            Menu.displayName = "Menu";
            var Header_Menu = Menu,
                HeaderContent =
                    (react.createElement,
                    function HeaderContent() {
                        var dispatch = (0, es.I0)(),
                            vw = (0, store.CG)(function (state) {
                                return state;
                            }).vw;
                        return (0, jsx_runtime.jsxs)("div", {
                            style: {
                                display: "flex",
                                alignItems: "center",
                                padding: null != vw && vw.xs ? "0" : "0 15px",
                                justifyContent: "space-evenly",
                            },
                            children: [
                                (0, jsx_runtime.jsx)(Header_Menu, {}),
                                (0, jsx_runtime.jsx)("a", {
                                    href: "/",
                                    style: {
                                        height: "56px",
                                        display: "grid",
                                        placeContent: "center",
                                    },
                                    children: (0, jsx_runtime.jsx)(Logo.Z, {
                                        color: "white",
                                    }),
                                }),
                                (0, jsx_runtime.jsx)(Search_SearchOverlay, {}),
                                (0, jsx_runtime.jsxs)(HeaderActions_style, {
                                    xs: 14,
                                    sm: 6,
                                    md: 6,
                                    children: [
                                        (null == vw ? void 0 : vw.xs) &&
                                            (0, jsx_runtime.jsx)(Button.Z, {
                                                onClick:
                                                    function handleClickSearchIcon() {
                                                        dispatch(
                                                            actions.Z.openResultsOverlay()
                                                        );
                                                    },
                                                "data-cy":
                                                    "testSearchPersonality",
                                                style: { height: "34px" },
                                                children: (0, jsx_runtime.jsx)(
                                                    SearchOutlined.Z,
                                                    {
                                                        style: {
                                                            fontSize: "16px",
                                                            color: "white",
                                                            padding: "8px",
                                                        },
                                                    }
                                                ),
                                            }),
                                        (0, jsx_runtime.jsx)(
                                            Header_DonateButton,
                                            { header: !0 }
                                        ),
                                        (0, jsx_runtime.jsx)(
                                            Header_UserMenu,
                                            {}
                                        ),
                                        !(null != vw && vw.sm) &&
                                            (0, jsx_runtime.jsx)(
                                                Header_SelectLanguage,
                                                {
                                                    dataCy: "LanguageButton",
                                                    defaultLanguage: "pt",
                                                }
                                            ),
                                    ],
                                }),
                            ],
                        });
                    });
            HeaderContent.displayName = "HeaderContent";
            var Header_HeaderContent = HeaderContent,
                ProviderWrapper = __webpack_require__(
                    "./src/stories/ProviderWrapper.tsx"
                ),
                HeaderContent_stories =
                    (react.createElement,
                    {
                        title: "Components/Layout/HeaderContent",
                        component: Header_HeaderContent,
                        decorators: [
                            function (Story) {
                                return (0, jsx_runtime.jsx)(ProviderWrapper.Z, {
                                    children: (0, jsx_runtime.jsx)(Story, {}),
                                });
                            },
                        ],
                    }),
                Template = function Template() {
                    return (0, jsx_runtime.jsx)(Header_HeaderContent, {
                        className: "aletheia-header",
                    });
                };
            Template.displayName = "Template";
            var Default = Template.bind({});
            Default.parameters = Object.assign(
                {
                    storySource: {
                        source: '() => (<HeaderContent className="aletheia-header" />)',
                    },
                },
                Default.parameters
            );
            var HeaderContent_stories_namedExportsOrder = ["Default"];
        },
        "./src/stories/components/layout/Logo.stories.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__),
                __webpack_require__.d(__webpack_exports__, {
                    Blue: function () {
                        return Blue;
                    },
                    White: function () {
                        return White;
                    },
                    __namedExportsOrder: function () {
                        return __namedExportsOrder;
                    },
                });
            var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    "./node_modules/react/index.js"
                ),
                _components_Header_Logo__WEBPACK_IMPORTED_MODULE_2__ =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/es.object.assign.js"
                    ),
                    __webpack_require__("./src/components/Header/Logo.tsx")),
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ =
                    __webpack_require__("./node_modules/react/jsx-runtime.js");
            react__WEBPACK_IMPORTED_MODULE_0__.createElement;
            __webpack_exports__.default = {
                title: "Components/Layout/Logo",
                component:
                    _components_Header_Logo__WEBPACK_IMPORTED_MODULE_2__.Z,
                argTypes: {
                    color: { options: ["blue", "white"], control: "radio" },
                },
            };
            var Template = function Template(args) {
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(
                    _components_Header_Logo__WEBPACK_IMPORTED_MODULE_2__.Z,
                    Object.assign({}, args)
                );
            };
            Template.displayName = "Template";
            var Blue = Template.bind({});
            Blue.args = { color: "blue" };
            var White = Template.bind({});
            (White.args = { color: "white" }),
                (White.parameters = { backgrounds: { default: "dark" } }),
                (Blue.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => (<Logo {...args} />)",
                        },
                    },
                    Blue.parameters
                )),
                (White.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => (<Logo {...args} />)",
                        },
                    },
                    White.parameters
                ));
            var __namedExportsOrder = ["Blue", "White"];
        },
        "./src/stories/components/layout/SearchOverlay.stories.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__),
                __webpack_require__.d(__webpack_exports__, {
                    Default: function () {
                        return Default;
                    },
                    __namedExportsOrder: function () {
                        return __namedExportsOrder;
                    },
                });
            var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    "./node_modules/react/index.js"
                ),
                _components_Search_OverlaySearchInput__WEBPACK_IMPORTED_MODULE_2__ =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/es.object.assign.js"
                    ),
                    __webpack_require__(
                        "./src/components/Search/OverlaySearchInput.tsx"
                    )),
                _ProviderWrapper__WEBPACK_IMPORTED_MODULE_3__ =
                    __webpack_require__("./src/stories/ProviderWrapper.tsx"),
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ =
                    __webpack_require__("./node_modules/react/jsx-runtime.js");
            react__WEBPACK_IMPORTED_MODULE_0__.createElement;
            __webpack_exports__.default = {
                title: "Components/Layout/OverlaySearchInput",
                component:
                    _components_Search_OverlaySearchInput__WEBPACK_IMPORTED_MODULE_2__.Z,
                args: { overlay: { results: !0, search: !0 } },
                decorators: [
                    function (Story) {
                        return (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(
                            _ProviderWrapper__WEBPACK_IMPORTED_MODULE_3__.Z,
                            {
                                children: (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(
                                    Story,
                                    {}
                                ),
                            }
                        );
                    },
                ],
            };
            var Template = function Template(args) {
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(
                    _components_Search_OverlaySearchInput__WEBPACK_IMPORTED_MODULE_2__.Z,
                    {}
                );
            };
            Template.displayName = "Template";
            var Default = Template.bind({});
            (Default.args = {}),
                (Default.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => (\n    <OverlaySearchInput />\n)",
                        },
                    },
                    Default.parameters
                ));
            var __namedExportsOrder = ["Default"];
        },
        "./src/stories/components/layout/Sidebar.stories.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__),
                __webpack_require__.d(__webpack_exports__, {
                    Default: function () {
                        return Default;
                    },
                    __namedExportsOrder: function () {
                        return __namedExportsOrder;
                    },
                    default: function () {
                        return Sidebar_stories;
                    },
                });
            var react = __webpack_require__("./node_modules/react/index.js"),
                drawer =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/es.object.assign.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/drawer/style/index.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/drawer/index.js"
                    )),
                es = __webpack_require__(
                    "./node_modules/react-redux/es/index.js"
                ),
                actions = __webpack_require__("./src/store/actions.ts"),
                store = __webpack_require__("./src/store/store.ts"),
                colors = __webpack_require__("./src/styles/colors.ts"),
                AletheiaMenu = __webpack_require__(
                    "./src/components/AletheiaMenu.tsx"
                ),
                Logo = __webpack_require__("./src/components/Header/Logo.tsx"),
                jsx_runtime = __webpack_require__(
                    "./node_modules/react/jsx-runtime.js"
                ),
                Sidebar =
                    (react.createElement,
                    function Sidebar() {
                        var dispatch = (0, es.I0)(),
                            menuCollapsed = (0, store.CG)(function (state) {
                                return {
                                    menuCollapsed:
                                        void 0 ===
                                            (null == state
                                                ? void 0
                                                : state.menuCollapsed) ||
                                        (null == state
                                            ? void 0
                                            : state.menuCollapsed),
                                };
                            }).menuCollapsed;
                        return (0, jsx_runtime.jsxs)(drawer.Z, {
                            visible: !menuCollapsed,
                            onClose: function onClose() {
                                return dispatch(actions.Z.closeSideMenu());
                            },
                            width: "17rem",
                            placement: "left",
                            bodyStyle: { padding: 0 },
                            drawerStyle: {
                                backgroundColor: colors.Z.lightGray,
                            },
                            closable: !1,
                            children: [
                                (0, jsx_runtime.jsx)("div", {
                                    style: {
                                        paddingTop: "16px",
                                        paddingLeft: "48px",
                                    },
                                    children: (0, jsx_runtime.jsx)(Logo.Z, {
                                        color: colors.Z.bluePrimary,
                                        height: "48px",
                                    }),
                                }),
                                (0, jsx_runtime.jsx)(AletheiaMenu.Z, {}),
                            ],
                        });
                    });
            Sidebar.displayName = "Sidebar";
            var components_Sidebar = Sidebar,
                ProviderWrapper = __webpack_require__(
                    "./src/stories/ProviderWrapper.tsx"
                ),
                Sidebar_stories =
                    (react.createElement,
                    {
                        title: "Components/Layout/Sidebar",
                        component: components_Sidebar,
                        args: { menuCollapsed: !1 },
                        argTypes: {
                            menuCollapsed: { control: { type: "boolean" } },
                        },
                        decorators: [
                            function (Story) {
                                return (0, jsx_runtime.jsx)(ProviderWrapper.Z, {
                                    children: (0, jsx_runtime.jsx)(Story, {}),
                                });
                            },
                        ],
                    }),
                Template = function Template(args) {
                    return (0, jsx_runtime.jsx)(
                        components_Sidebar,
                        Object.assign({}, args)
                    );
                };
            Template.displayName = "Template";
            var Default = Template.bind({});
            (Default.args = { menuCollapsed: !1 }),
                (Default.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => (\n    <Sidebar {...args} />\n)",
                        },
                    },
                    Default.parameters
                ));
            var __namedExportsOrder = ["Default"];
        },
        "./src/stories/components/metrics/MetricsOverview.stories.tsx":
            function (
                __unused_webpack_module,
                __webpack_exports__,
                __webpack_require__
            ) {
                "use strict";
                __webpack_require__.r(__webpack_exports__),
                    __webpack_require__.d(__webpack_exports__, {
                        Empty: function () {
                            return Empty;
                        },
                        ManyStats: function () {
                            return ManyStats;
                        },
                        OneStat: function () {
                            return OneStat;
                        },
                        __namedExportsOrder: function () {
                            return __namedExportsOrder;
                        },
                        default: function () {
                            return MetricsOverview_stories;
                        },
                    });
                var react = __webpack_require__(
                        "./node_modules/react/index.js"
                    ),
                    row =
                        (__webpack_require__(
                            "./node_modules/core-js/modules/es.object.assign.js"
                        ),
                        __webpack_require__(
                            "./node_modules/antd/lib/row/style/index.js"
                        ),
                        __webpack_require__(
                            "./node_modules/antd/lib/row/index.js"
                        )),
                    col =
                        (__webpack_require__(
                            "./node_modules/antd/lib/col/style/index.js"
                        ),
                        __webpack_require__(
                            "./node_modules/antd/lib/col/index.js"
                        )),
                    ReviewStats = __webpack_require__(
                        "./src/components/Metrics/ReviewStats.tsx"
                    ),
                    useTranslation = __webpack_require__(
                        "./node_modules/react-i18next/dist/es/useTranslation.js"
                    ),
                    colors = __webpack_require__("./src/styles/colors.ts"),
                    jsx_runtime = __webpack_require__(
                        "./node_modules/react/jsx-runtime.js"
                    ),
                    MetricsOverview =
                        (react.createElement,
                        function MetricsOverview(_ref) {
                            var stats = _ref.stats,
                                t = (0, useTranslation.$)().t;
                            return (0, jsx_runtime.jsx)(row.Z, {
                                children: (0, jsx_runtime.jsxs)(col.Z, {
                                    style: { width: "100%", color: "#262626" },
                                    offset: 2,
                                    span: 18,
                                    children: [
                                        (null == stats
                                            ? void 0
                                            : stats.reviews) &&
                                            (null == stats
                                                ? void 0
                                                : stats.reviews.lenght) &&
                                            (0, jsx_runtime.jsxs)("div", {
                                                children: [
                                                    (0, jsx_runtime.jsx)("p", {
                                                        style: {
                                                            fontSize: 14,
                                                            lineHeight: "20px",
                                                            fontWeight: 700,
                                                            color: colors.Z
                                                                .blackSecondary,
                                                            marginBottom: 0,
                                                        },
                                                        children: t(
                                                            "metrics:headerTitle"
                                                        ),
                                                    }),
                                                    (0, jsx_runtime.jsx)("p", {
                                                        style: {
                                                            fontSize: 14,
                                                            lineHeight: "22px",
                                                            color: colors.Z
                                                                .blackSecondary,
                                                            marginBottom:
                                                                "16px",
                                                        },
                                                        children:
                                                            t("metrics:header"),
                                                    }),
                                                ],
                                            }),
                                        (0, jsx_runtime.jsx)(ReviewStats.Z, {
                                            stats: stats,
                                            countInTitle: !0,
                                            type: "line",
                                        }),
                                    ],
                                }),
                            });
                        });
                MetricsOverview.displayName = "MetricsOverview";
                var Metrics_MetricsOverview = MetricsOverview;
                try {
                    (MetricsOverview.displayName = "MetricsOverview"),
                        (MetricsOverview.__docgenInfo = {
                            description: "",
                            displayName: "MetricsOverview",
                            props: {
                                stats: {
                                    defaultValue: null,
                                    description: "",
                                    name: "stats",
                                    required: !0,
                                    type: { name: "any" },
                                },
                            },
                        }),
                        "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                            (STORYBOOK_REACT_CLASSES[
                                "src/components/Metrics/MetricsOverview.tsx#MetricsOverview"
                            ] = {
                                docgenInfo: MetricsOverview.__docgenInfo,
                                name: "MetricsOverview",
                                path: "src/components/Metrics/MetricsOverview.tsx#MetricsOverview",
                            });
                } catch (__react_docgen_typescript_loader_error) {}
                var fixtures = __webpack_require__("./src/stories/fixtures.ts"),
                    MetricsOverview_stories =
                        (react.createElement,
                        {
                            title: "Components/Metrics/MetricsOverview",
                            component: Metrics_MetricsOverview,
                            args: {
                                stats: {
                                    total: 1,
                                    reviews: [
                                        {
                                            _id: "true",
                                            percentage: "100",
                                            count: 1,
                                        },
                                    ],
                                    totalClaims: 23,
                                },
                            },
                        }),
                    Template = function Template(args) {
                        return (0, jsx_runtime.jsx)(
                            Metrics_MetricsOverview,
                            Object.assign({}, args)
                        );
                    };
                Template.displayName = "Template";
                var OneStat = Template.bind({});
                OneStat.args = {};
                var ManyStats = Template.bind({});
                ManyStats.args = {
                    stats: {
                        total: 8,
                        reviews: (0, fixtures.fy)(8),
                        totalClaims: 8,
                    },
                };
                var Empty = Template.bind({});
                (Empty.args = {
                    stats: { total: 0, reviews: [], totalClaims: null },
                }),
                    (OneStat.parameters = Object.assign(
                        {
                            storySource: {
                                source: "(args) => (\n    <MetricsOverview {...args} />\n)",
                            },
                        },
                        OneStat.parameters
                    )),
                    (ManyStats.parameters = Object.assign(
                        {
                            storySource: {
                                source: "(args) => (\n    <MetricsOverview {...args} />\n)",
                            },
                        },
                        ManyStats.parameters
                    )),
                    (Empty.parameters = Object.assign(
                        {
                            storySource: {
                                source: "(args) => (\n    <MetricsOverview {...args} />\n)",
                            },
                        },
                        Empty.parameters
                    ));
                var __namedExportsOrder = ["OneStat", "ManyStats", "Empty"];
            },
        "./src/stories/components/metrics/ReviewStats.stories.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__),
                __webpack_require__.d(__webpack_exports__, {
                    __namedExportsOrder: function () {
                        return __namedExportsOrder;
                    },
                    circle: function () {
                        return circle;
                    },
                    line: function () {
                        return line;
                    },
                    summarized: function () {
                        return summarized;
                    },
                });
            var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    "./node_modules/react/index.js"
                ),
                _components_Metrics_ReviewStats__WEBPACK_IMPORTED_MODULE_2__ =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/es.object.assign.js"
                    ),
                    __webpack_require__(
                        "./src/components/Metrics/ReviewStats.tsx"
                    )),
                _fixtures__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
                    "./src/stories/fixtures.ts"
                ),
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ =
                    __webpack_require__("./node_modules/react/jsx-runtime.js");
            react__WEBPACK_IMPORTED_MODULE_0__.createElement;
            __webpack_exports__.default = {
                title: "Components/Metrics/ReviewStats",
                component:
                    _components_Metrics_ReviewStats__WEBPACK_IMPORTED_MODULE_2__.Z,
                decorators: [
                    function (Story) {
                        return (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(
                            "div",
                            {
                                style: { width: "200px" },
                                children: (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(
                                    Story,
                                    {}
                                ),
                            }
                        );
                    },
                ],
                argTypes: {
                    numOfStats: {
                        control: {
                            type: "range",
                            min: 0,
                            max: _fixtures__WEBPACK_IMPORTED_MODULE_3__.xt
                                .length,
                            step: 1,
                        },
                    },
                    type: {
                        options: ["line", "circle"],
                        control: { type: "radio" },
                    },
                    format: {
                        options: ["percentage", "count"],
                        control: { type: "radio" },
                    },
                },
                args: {
                    stats: {
                        reviews: [{ _id: "true", percentage: "100", count: 1 }],
                    },
                    numOfStats: 1,
                    countInTitle: !0,
                    type: "circle",
                    format: "count",
                    strokeWidth: 18,
                    width: 80,
                },
            };
            var Template = function Template(args) {
                return (
                    (args.stats.reviews = (0,
                    _fixtures__WEBPACK_IMPORTED_MODULE_3__.fy)(
                        args.numOfStats
                    )),
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(
                        _components_Metrics_ReviewStats__WEBPACK_IMPORTED_MODULE_2__.Z,
                        Object.assign({}, args)
                    )
                );
            };
            Template.displayName = "Template";
            var circle = Template.bind({});
            circle.decorators = [
                function (Story) {
                    return (0,
                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
                        style: { width: "80px" },
                        children: (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(
                            Story,
                            {}
                        ),
                    });
                },
            ];
            var summarized = Template.bind({});
            (summarized.args = {
                width: 30,
                strokeWidth: 16,
                countInTitle: !1,
            }),
                (summarized.decorators = [
                    function (Story) {
                        return (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(
                            "div",
                            {
                                style: { width: "30px" },
                                children: (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(
                                    Story,
                                    {}
                                ),
                            }
                        );
                    },
                ]);
            var line = Template.bind({});
            (line.args = { type: "line", format: "percentage" }),
                (circle.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => {\n    args.stats.reviews = getStats(args.numOfStats);\n\n    return (\n        <ReviewStats {...args} />\n    );\n}",
                        },
                    },
                    circle.parameters
                )),
                (summarized.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => {\n    args.stats.reviews = getStats(args.numOfStats);\n\n    return (\n        <ReviewStats {...args} />\n    );\n}",
                        },
                    },
                    summarized.parameters
                )),
                (line.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => {\n    args.stats.reviews = getStats(args.numOfStats);\n\n    return (\n        <ReviewStats {...args} />\n    );\n}",
                        },
                    },
                    line.parameters
                ));
            var __namedExportsOrder = ["circle", "summarized", "line"];
        },
        "./src/stories/components/personality/PersonalityCard.stories.tsx":
            function (
                __unused_webpack_module,
                __webpack_exports__,
                __webpack_require__
            ) {
                "use strict";
                __webpack_require__.r(__webpack_exports__),
                    __webpack_require__.d(__webpack_exports__, {
                        Default: function () {
                            return Default;
                        },
                        __namedExportsOrder: function () {
                            return PersonalityCard_stories_namedExportsOrder;
                        },
                        allStats: function () {
                            return allStats;
                        },
                        default: function () {
                            return PersonalityCard_stories;
                        },
                        disableStats: function () {
                            return disableStats;
                        },
                        header: function () {
                            return header;
                        },
                        sumarizedAllStats: function () {
                            return sumarizedAllStats;
                        },
                        summarized: function () {
                            return summarized;
                        },
                    });
                var react = __webpack_require__(
                        "./node_modules/react/index.js"
                    ),
                    row =
                        (__webpack_require__(
                            "./node_modules/core-js/modules/es.object.assign.js"
                        ),
                        __webpack_require__(
                            "./node_modules/antd/lib/row/style/index.js"
                        ),
                        __webpack_require__(
                            "./node_modules/antd/lib/row/index.js"
                        )),
                    divider =
                        (__webpack_require__(
                            "./node_modules/antd/lib/divider/style/index.js"
                        ),
                        __webpack_require__(
                            "./node_modules/antd/lib/divider/index.js"
                        )),
                    col =
                        (__webpack_require__(
                            "./node_modules/antd/lib/col/style/index.js"
                        ),
                        __webpack_require__(
                            "./node_modules/antd/lib/col/index.js"
                        )),
                    slicedToArray = __webpack_require__(
                        "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js"
                    ),
                    typography =
                        (__webpack_require__(
                            "./node_modules/antd/lib/typography/style/index.js"
                        ),
                        __webpack_require__(
                            "./node_modules/antd/lib/typography/index.js"
                        )),
                    PlusOutlined =
                        (__webpack_require__(
                            "./node_modules/core-js/modules/es.symbol.js"
                        ),
                        __webpack_require__(
                            "./node_modules/core-js/modules/es.symbol.description.js"
                        ),
                        __webpack_require__(
                            "./node_modules/@ant-design/icons/es/icons/PlusOutlined.js"
                        )),
                    useTranslation = __webpack_require__(
                        "./node_modules/react-i18next/dist/es/useTranslation.js"
                    ),
                    colors = __webpack_require__("./src/styles/colors.ts"),
                    avatar =
                        (__webpack_require__(
                            "./node_modules/antd/lib/avatar/style/index.js"
                        ),
                        __webpack_require__(
                            "./node_modules/antd/lib/avatar/index.js"
                        )),
                    jsx_runtime = __webpack_require__(
                        "./node_modules/react/jsx-runtime.js"
                    ),
                    AletheiaAvatar =
                        (react.createElement,
                        function AletheiaAvatar(_ref) {
                            var size = _ref.size,
                                src = _ref.src,
                                alt = _ref.alt,
                                borderWidth = size < 100 ? 0.02 * size : 2,
                                borderGap = 6 * borderWidth;
                            return (0, jsx_runtime.jsx)("div", {
                                style: {
                                    width: size + borderGap,
                                    height: size + borderGap,
                                    border:
                                        borderWidth +
                                        "px solid " +
                                        colors.Z.blueQuartiary,
                                    display: "grid",
                                    placeContent: "center",
                                    borderRadius: "50%",
                                    aspectRatio: "1",
                                },
                                children: (0, jsx_runtime.jsx)(avatar.ZP, {
                                    size: size,
                                    src: src,
                                    alt: alt,
                                }),
                            });
                        });
                AletheiaAvatar.displayName = "AletheiaAvatar";
                var components_AletheiaAvatar = AletheiaAvatar;
                try {
                    (AletheiaAvatar.displayName = "AletheiaAvatar"),
                        (AletheiaAvatar.__docgenInfo = {
                            description: "",
                            displayName: "AletheiaAvatar",
                            props: {
                                size: {
                                    defaultValue: null,
                                    description: "",
                                    name: "size",
                                    required: !0,
                                    type: { name: "number" },
                                },
                                src: {
                                    defaultValue: null,
                                    description: "",
                                    name: "src",
                                    required: !0,
                                    type: { name: "string" },
                                },
                                alt: {
                                    defaultValue: null,
                                    description: "",
                                    name: "alt",
                                    required: !0,
                                    type: { name: "string" },
                                },
                            },
                        }),
                        "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                            (STORYBOOK_REACT_CLASSES[
                                "src/components/AletheiaAvatar.tsx#AletheiaAvatar"
                            ] = {
                                docgenInfo: AletheiaAvatar.__docgenInfo,
                                name: "AletheiaAvatar",
                                path: "src/components/AletheiaAvatar.tsx#AletheiaAvatar",
                            });
                } catch (__react_docgen_typescript_loader_error) {}
                var Button = __webpack_require__("./src/components/Button.tsx"),
                    ReviewStats = __webpack_require__(
                        "./src/components/Metrics/ReviewStats.tsx"
                    ),
                    skeleton =
                        (__webpack_require__(
                            "./node_modules/antd/lib/skeleton/style/index.js"
                        ),
                        __webpack_require__(
                            "./node_modules/antd/lib/skeleton/index.js"
                        )),
                    PersonalitySkeleton =
                        (react.createElement,
                        function PersonalitySkeleton() {
                            return (0, jsx_runtime.jsxs)(row.Z, {
                                style: { marginBottom: 64, width: "100%" },
                                children: [
                                    (0, jsx_runtime.jsx)(col.Z, {
                                        span: 20,
                                        style: { paddingLeft: 50 },
                                        children: (0, jsx_runtime.jsx)(
                                            skeleton.Z,
                                            {
                                                avatar: !0,
                                                active: !0,
                                                paragraph: {
                                                    rows: 2,
                                                    width: ["75%", "50%"],
                                                },
                                            }
                                        ),
                                    }),
                                    (0, jsx_runtime.jsx)(col.Z, {
                                        span: 4,
                                        style: {
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            padding: "10px 0",
                                        },
                                        children: (0, jsx_runtime.jsx)(
                                            skeleton.Z.Button,
                                            { active: !0, size: "large" }
                                        ),
                                    }),
                                ],
                            });
                        });
                PersonalitySkeleton.displayName = "PersonalitySkeleton";
                var CreateClaimEvents,
                    CreateClaimStates,
                    Skeleton_PersonalitySkeleton = PersonalitySkeleton,
                    store = __webpack_require__("./src/store/store.ts"),
                    esm = __webpack_require__(
                        "./node_modules/jotai/esm/index.mjs"
                    ),
                    xstate = __webpack_require__(
                        "./node_modules/jotai/esm/xstate.mjs"
                    ),
                    enableImageClaim = (0, esm.cn)(!1),
                    enums = __webpack_require__("./src/types/enums.ts"),
                    initialContext = {
                        claimData: {
                            title: "",
                            date: new Date().toLocaleDateString(),
                            sources: [],
                        },
                    },
                    Machine = __webpack_require__(
                        "./node_modules/xstate/es/Machine.js"
                    );
                !(function (CreateClaimEvents) {
                    (CreateClaimEvents.startSpeech = "START_SPEECH"),
                        (CreateClaimEvents.startImage = "START_IMAGE"),
                        (CreateClaimEvents.startDebate = "START_DEBATE"),
                        (CreateClaimEvents.addPersonality = "ADD_PERSONALITY"),
                        (CreateClaimEvents.removePersonality =
                            "REMOVE_PERSONALITY"),
                        (CreateClaimEvents.savePersonality =
                            "SAVE_PERSONALITY"),
                        (CreateClaimEvents.noPersonality = "NO_PERSONALITY"),
                        (CreateClaimEvents.persist = "PERSIST");
                })(CreateClaimEvents || (CreateClaimEvents = {})),
                    (function (CreateClaimStates) {
                        (CreateClaimStates.notStarted = "not_started"),
                            (CreateClaimStates.setupSpeech = "setup_speech"),
                            (CreateClaimStates.setupImage = "setup_image"),
                            (CreateClaimStates.setupDebate = "setup_debate"),
                            (CreateClaimStates.personalityAdded =
                                "personality_added"),
                            (CreateClaimStates.persisted = "persisted");
                    })(CreateClaimStates || (CreateClaimStates = {}));
                __webpack_require__(
                    "./node_modules/core-js/modules/es.array.filter.js"
                ),
                    __webpack_require__(
                        "./node_modules/core-js/modules/es.array.map.js"
                    );
                var es = __webpack_require__(
                        "./node_modules/xstate/es/index.js"
                    ),
                    message =
                        (__webpack_require__(
                            "./node_modules/antd/lib/message/style/index.js"
                        ),
                        __webpack_require__(
                            "./node_modules/antd/lib/message/index.js"
                        )),
                    axios = __webpack_require__(
                        "./node_modules/axios/index.js"
                    ),
                    request = __webpack_require__
                        .n(axios)()
                        .create({ withCredentials: !0, baseURL: "/api/claim" }),
                    claimApi = {
                        get: function get(options) {
                            var _options$i18n,
                                params = {
                                    page: options.page ? options.page - 1 : 0,
                                    order: options.order || "asc",
                                    name: options.searchName,
                                    pageSize: options.pageSize
                                        ? options.pageSize
                                        : 5,
                                    personality: options.personality,
                                    language:
                                        null == options ||
                                        null ===
                                            (_options$i18n = options.i18n) ||
                                        void 0 === _options$i18n
                                            ? void 0
                                            : _options$i18n.languages[0],
                                };
                            return request
                                .get("/", { params: params })
                                .then(function (response) {
                                    var _response$data = response.data,
                                        claims = _response$data.claims,
                                        totalPages = _response$data.totalPages,
                                        totalClaims =
                                            _response$data.totalClaims;
                                    if (options.fetchOnly)
                                        return {
                                            data: claims,
                                            total: totalClaims,
                                            totalPages: totalPages,
                                        };
                                })
                                .catch(function (e) {
                                    throw e;
                                });
                        },
                        getById: function getById(id, t) {
                            var params =
                                arguments.length > 2 && void 0 !== arguments[2]
                                    ? arguments[2]
                                    : {};
                            return request
                                .get("" + id, { params: params })
                                .then(function (response) {
                                    return response.data;
                                })
                                .catch(function () {
                                    message.default.error(
                                        t("claim:errorWhileFetching")
                                    );
                                });
                        },
                        saveSpeech: function saveSpeech(t) {
                            var claim =
                                arguments.length > 1 && void 0 !== arguments[1]
                                    ? arguments[1]
                                    : {};
                            return request
                                .post("/", claim)
                                .then(function (response) {
                                    var title = response.data.title;
                                    return (
                                        message.default.success(
                                            '"' +
                                                title +
                                                '" ' +
                                                t(
                                                    "claimForm:successCreateMessage"
                                                )
                                        ),
                                        response.data
                                    );
                                })
                                .catch(function (err) {
                                    var response = err && err.response,
                                        data = response.data;
                                    message.default.error(
                                        data && data.message
                                            ? data.message
                                            : t("claimForm:errorCreateMessage")
                                    );
                                });
                        },
                        saveImage: function saveImage(t) {
                            var claimImage =
                                arguments.length > 1 && void 0 !== arguments[1]
                                    ? arguments[1]
                                    : {};
                            return request
                                .post("/image", claimImage)
                                .then(function (response) {
                                    var title = response.data.title;
                                    return (
                                        message.default.success(
                                            '"' +
                                                title +
                                                '" ' +
                                                t(
                                                    "claimForm:successCreateMessage"
                                                )
                                        ),
                                        response.data
                                    );
                                })
                                .catch(function (err) {
                                    var response = err && err.response;
                                    message.default.error(
                                        null != response &&
                                            response.data &&
                                            null != response &&
                                            response.data.message
                                            ? null == response
                                                ? void 0
                                                : response.data.message
                                            : t("claimForm:errorCreateMessage")
                                    );
                                });
                        },
                        saveDebate: function saveDebate(t) {
                            var debate =
                                arguments.length > 1 && void 0 !== arguments[1]
                                    ? arguments[1]
                                    : {};
                            return request
                                .post("/debate", debate)
                                .then(function (response) {
                                    var title = response.data.title;
                                    return (
                                        message.default.success(
                                            '"' +
                                                title +
                                                '" ' +
                                                t(
                                                    "claimForm:successCreateMessage"
                                                )
                                        ),
                                        response.data
                                    );
                                })
                                .catch(function (err) {
                                    (err && err.response) || console.error(err);
                                });
                        },
                        updateDebate: function updateDebate(
                            debateId,
                            t,
                            params
                        ) {
                            return request
                                .put("/debate/" + debateId, params)
                                .then(function (response) {
                                    return response.data;
                                })
                                .catch(function (err) {
                                    var response = err && err.response,
                                        data = response.data;
                                    message.default.error(
                                        data && data.message
                                            ? data.message
                                            : t("claimForm:errorUpdateMessage")
                                    );
                                });
                        },
                    },
                    claim = claimApi,
                    saveClaimContext = (0, es.f0)(function (context, event) {
                        return {
                            claimData: Object.assign(
                                {},
                                context.claimData,
                                event.claimData
                            ),
                        };
                    }),
                    startSpeech = (0, es.f0)(function (context) {
                        return {
                            claimData: Object.assign({}, context.claimData, {
                                contentModel: enums.BN.Speech,
                            }),
                        };
                    }),
                    startImage = (0, es.f0)(function (context) {
                        return {
                            claimData: Object.assign({}, context.claimData, {
                                contentModel: enums.BN.Image,
                            }),
                        };
                    }),
                    startDebate = (0, es.f0)(function (context) {
                        return {
                            claimData: Object.assign({}, context.claimData, {
                                contentModel: enums.BN.Debate,
                            }),
                        };
                    }),
                    removePersonality = (0, es.f0)(function (contex, event) {
                        var personality = event.personality,
                            personalities = contex.claimData.personalities;
                        return {
                            claimData: Object.assign({}, contex.claimData, {
                                personalities: personalities.filter(function (
                                    p
                                ) {
                                    return p._id !== personality._id;
                                }),
                            }),
                        };
                    }),
                    persistClaim = (0, es.f0)(function (context, event) {
                        var _saveFunctions,
                            claimData = Object.assign(
                                {},
                                context.claimData,
                                event.claimData
                            ),
                            t = event.t,
                            router = event.router,
                            sendData = Object.assign({}, claimData, {
                                personalities: claimData.personalities.map(
                                    function (p) {
                                        return p._id;
                                    }
                                ),
                            });
                        return (
                            (((_saveFunctions = {})[enums.BN.Speech] =
                                claim.saveSpeech),
                            (_saveFunctions[enums.BN.Image] = claim.saveImage),
                            (_saveFunctions[enums.BN.Debate] =
                                claim.saveDebate),
                            _saveFunctions)
                                [claimData.contentModel](t, sendData)
                                .then(function (claim) {
                                    router.push(claim.path);
                                })
                                .catch(function (err) {
                                    console.error(
                                        "error saving the claim",
                                        err
                                    );
                                }),
                            { claimData: claimData }
                        );
                    }),
                    claimPersonalities = (0, esm.cn)([]),
                    machineConfig = (0, esm.cn)(function (get) {
                        var imagesEnabled = get(enableImageClaim),
                            value = imagesEnabled
                                ? CreateClaimStates.notStarted
                                : CreateClaimStates.setupSpeech,
                            personalities = get(claimPersonalities);
                        return {
                            value: value,
                            context: Object.assign({}, initialContext, {
                                claimData: {
                                    personalities: personalities,
                                    contentModel: imagesEnabled
                                        ? null
                                        : enums.BN.Speech,
                                },
                            }),
                        };
                    }),
                    createClaimMachineAtom = (0, xstate.j)(function (get) {
                        return (function newCreateClaimMachine(_ref) {
                            var _on,
                                _on2,
                                _on3,
                                _on4,
                                _on5,
                                _states,
                                value = _ref.value,
                                context = _ref.context;
                            return (0,
                            Machine.C)({ initial: value, context: context, states: ((_states = {}), (_states[CreateClaimStates.notStarted] = { on: ((_on = {}), (_on[CreateClaimEvents.startSpeech] = { target: CreateClaimStates.setupSpeech, actions: [startSpeech] }), (_on[CreateClaimEvents.startImage] = { target: CreateClaimStates.setupImage, actions: [startImage] }), (_on[CreateClaimEvents.startDebate] = { target: CreateClaimStates.setupDebate, actions: [startDebate] }), _on) }), (_states[CreateClaimStates.setupSpeech] = { on: ((_on2 = {}), (_on2[CreateClaimEvents.addPersonality] = { target: CreateClaimStates.setupSpeech, actions: [saveClaimContext] }), (_on2[CreateClaimEvents.savePersonality] = { target: CreateClaimStates.personalityAdded }), (_on2[CreateClaimEvents.removePersonality] = { target: CreateClaimStates.setupSpeech, actions: [removePersonality] }), _on2) }), (_states[CreateClaimStates.setupImage] = { on: ((_on3 = {}), (_on3[CreateClaimEvents.addPersonality] = { target: CreateClaimStates.setupImage, actions: [saveClaimContext] }), (_on3[CreateClaimEvents.noPersonality] = { target: CreateClaimStates.personalityAdded, actions: [saveClaimContext] }), (_on3[CreateClaimEvents.savePersonality] = { target: CreateClaimStates.personalityAdded }), _on3) }), (_states[CreateClaimStates.setupDebate] = { on: ((_on4 = {}), (_on4[CreateClaimEvents.addPersonality] = { target: CreateClaimStates.setupDebate, actions: [saveClaimContext] }), (_on4[CreateClaimEvents.savePersonality] = { target: CreateClaimStates.personalityAdded }), (_on4[CreateClaimEvents.removePersonality] = { target: CreateClaimStates.setupDebate, actions: [removePersonality] }), _on4) }), (_states[CreateClaimStates.personalityAdded] = { on: ((_on5 = {}), (_on5[CreateClaimEvents.persist] = { target: CreateClaimStates.persisted, actions: [persistClaim] }), _on5) }), (_states[CreateClaimStates.persisted] = { type: "final" }), _states) });
                        })(get(machineConfig));
                    }),
                    Title = (react.createElement, typography.Z.Title),
                    Paragraph = typography.Z.Paragraph,
                    PersonalityCard = function PersonalityCard(_ref) {
                        var cardStyle,
                            _personality$stats,
                            _personality$stats2,
                            _personality$claims,
                            _personality$stats3,
                            _personality$stats4,
                            personality = _ref.personality,
                            _ref$summarized = _ref.summarized,
                            summarized =
                                void 0 !== _ref$summarized && _ref$summarized,
                            _ref$enableStats = _ref.enableStats,
                            enableStats =
                                void 0 === _ref$enableStats || _ref$enableStats,
                            _ref$header = _ref.header,
                            header = void 0 !== _ref$header && _ref$header,
                            _ref$hrefBase = _ref.hrefBase,
                            hrefBase =
                                void 0 === _ref$hrefBase ? "" : _ref$hrefBase,
                            _ref$mobile = _ref.mobile,
                            mobile = void 0 !== _ref$mobile && _ref$mobile,
                            _ref$fullWidth = _ref.fullWidth,
                            fullWidth =
                                void 0 !== _ref$fullWidth && _ref$fullWidth,
                            _ref$hoistAvatar = _ref.hoistAvatar,
                            hoistAvatar =
                                void 0 !== _ref$hoistAvatar && _ref$hoistAvatar,
                            style = _ref.style,
                            _onClick = _ref.onClick,
                            _ref$titleLevel = _ref.titleLevel,
                            titleLevel =
                                void 0 === _ref$titleLevel
                                    ? 1
                                    : _ref$titleLevel,
                            _ref$selectPersonalit = _ref.selectPersonality,
                            selectPersonality =
                                void 0 === _ref$selectPersonalit
                                    ? null
                                    : _ref$selectPersonalit,
                            isFormSubmitted = _ref.isFormSubmitted,
                            isCreatingClaim = null !== selectPersonality,
                            _useAtom = (0, esm.KO)(createClaimMachineAtom),
                            personalities = (0, slicedToArray.Z)(_useAtom, 1)[0]
                                .context.claimData.personalities,
                            _useAppSelector = (0, store.CG)(function (state) {
                                return state;
                            }),
                            vw = _useAppSelector.vw,
                            personalityFoundProps = isCreatingClaim
                                ? {
                                      onClick: function onClick() {
                                          selectPersonality &&
                                              selectPersonality(personality);
                                      },
                                  }
                                : {
                                      href:
                                          "" +
                                          (hrefBase || "/personality/") +
                                          personality.slug,
                                      onClick: _onClick,
                                  },
                            personalityIsSelected = personalities.some(
                                function (item) {
                                    return item._id === personality._id;
                                }
                            ),
                            t = (0, useTranslation.$)().t,
                            componentStyle = {
                                titleSpan: fullWidth ? 24 : 14,
                                avatarSpan: fullWidth ? 24 : 8,
                                buttonSpan: fullWidth ? 24 : 5,
                                avatarSize: 90,
                            };
                        return (
                            summarized &&
                                ((componentStyle.titleSpan = 10),
                                (componentStyle.avatarSpan = 5),
                                (componentStyle.buttonSpan = 9),
                                (componentStyle.avatarSize = 43)),
                            header && (componentStyle.avatarSize = 144),
                            header ||
                                (cardStyle = {
                                    background: "#FFFFFF",
                                    border: "1px solid #EEEEEE",
                                    boxSizing: "border-box",
                                    boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.2)",
                                    borderRadius: "10px",
                                    marginBottom: "10px",
                                }),
                            personality
                                ? (0, jsx_runtime.jsxs)(row.Z, {
                                      style: Object.assign(
                                          { width: "100%" },
                                          cardStyle,
                                          style
                                      ),
                                      children: [
                                          hoistAvatar &&
                                              (0, jsx_runtime.jsx)(
                                                  components_AletheiaAvatar,
                                                  {
                                                      size: componentStyle.avatarSize,
                                                      src: personality.avatar,
                                                      alt: t(
                                                          "seo:personalityImageAlt",
                                                          {
                                                              name: personality.name,
                                                          }
                                                      ),
                                                  }
                                              ),
                                          (0, jsx_runtime.jsx)(col.Z, {
                                              md: 24,
                                              lg:
                                                  !header || mobile || fullWidth
                                                      ? 24
                                                      : 12,
                                              style: {
                                                  width: "100%",
                                                  textAlign: hoistAvatar
                                                      ? "center"
                                                      : "inherit",
                                              },
                                              children: (0, jsx_runtime.jsxs)(
                                                  row.Z,
                                                  {
                                                      gutter: summarized
                                                          ? 0
                                                          : 20,
                                                      align: header
                                                          ? "middle"
                                                          : "top",
                                                      style: {
                                                          width: "100%",
                                                          padding: "15px",
                                                          paddingBottom: 0,
                                                      },
                                                      children: [
                                                          !hoistAvatar &&
                                                              (0,
                                                              jsx_runtime.jsx)(
                                                                  col.Z,
                                                                  {
                                                                      span: componentStyle.avatarSpan,
                                                                      style: {
                                                                          minWidth:
                                                                              componentStyle.avatarSize,
                                                                      },
                                                                      children:
                                                                          (0,
                                                                          jsx_runtime.jsx)(
                                                                              components_AletheiaAvatar,
                                                                              {
                                                                                  size: componentStyle.avatarSize,
                                                                                  src: personality.avatar,
                                                                                  alt: t(
                                                                                      "seo:personalityImageAlt",
                                                                                      {
                                                                                          name: personality.name,
                                                                                      }
                                                                                  ),
                                                                              }
                                                                          ),
                                                                  }
                                                              ),
                                                          ((hoistAvatar &&
                                                              (!(
                                                                  null != vw &&
                                                                  vw.sm
                                                              ) ||
                                                                  !(
                                                                      null !=
                                                                          vw &&
                                                                      vw.xs
                                                                  ))) ||
                                                              !hoistAvatar) &&
                                                              (0,
                                                              jsx_runtime.jsxs)(
                                                                  col.Z,
                                                                  {
                                                                      span: componentStyle.titleSpan,
                                                                      className:
                                                                          "personality-card-content",
                                                                      style: {
                                                                          width: "100%",
                                                                      },
                                                                      children:
                                                                          [
                                                                              summarized &&
                                                                                  (0,
                                                                                  jsx_runtime.jsx)(
                                                                                      Paragraph,
                                                                                      {
                                                                                          style: {
                                                                                              fontSize:
                                                                                                  "14px",
                                                                                              lineHeight:
                                                                                                  "20px",
                                                                                              fontWeight: 600,
                                                                                              marginBottom: 4,
                                                                                          },
                                                                                          children:
                                                                                              personality.name,
                                                                                      }
                                                                                  ),
                                                                              !summarized &&
                                                                                  (0,
                                                                                  jsx_runtime.jsx)(
                                                                                      Title,
                                                                                      {
                                                                                          level: titleLevel,
                                                                                          style: {
                                                                                              fontSize:
                                                                                                  "24px",
                                                                                              lineHeight:
                                                                                                  "32px",
                                                                                              fontWeight: 400,
                                                                                              marginBottom: 4,
                                                                                          },
                                                                                          children:
                                                                                              personality.name,
                                                                                      }
                                                                                  ),
                                                                              (0,
                                                                              jsx_runtime.jsx)(
                                                                                  Paragraph,
                                                                                  {
                                                                                      style: {
                                                                                          fontSize:
                                                                                              summarized
                                                                                                  ? "10px"
                                                                                                  : "14px",
                                                                                          color: colors
                                                                                              .Z
                                                                                              .blackSecondary,
                                                                                          marginBottom: 4,
                                                                                      },
                                                                                      children:
                                                                                          personality.description,
                                                                                  }
                                                                              ),
                                                                              summarized &&
                                                                                  enableStats &&
                                                                                  void 0 !==
                                                                                      (null ===
                                                                                          (_personality$stats =
                                                                                              personality.stats) ||
                                                                                      void 0 ===
                                                                                          _personality$stats
                                                                                          ? void 0
                                                                                          : _personality$stats.total) &&
                                                                                  (0,
                                                                                  jsx_runtime.jsx)(
                                                                                      Paragraph,
                                                                                      {
                                                                                          style: {
                                                                                              fontSize:
                                                                                                  "10px",
                                                                                              fontWeight: 600,
                                                                                              lineHeight:
                                                                                                  "15px",
                                                                                              color: colors
                                                                                                  .Z
                                                                                                  .blackSecondary,
                                                                                          },
                                                                                          children:
                                                                                              (0,
                                                                                              jsx_runtime.jsx)(
                                                                                                  "b",
                                                                                                  {
                                                                                                      children:
                                                                                                          t(
                                                                                                              "personality:headerReviewsTotal",
                                                                                                              {
                                                                                                                  totalReviews:
                                                                                                                      null ===
                                                                                                                          (_personality$stats2 =
                                                                                                                              personality.stats) ||
                                                                                                                      void 0 ===
                                                                                                                          _personality$stats2
                                                                                                                          ? void 0
                                                                                                                          : _personality$stats2.total,
                                                                                                              }
                                                                                                          ),
                                                                                                  }
                                                                                              ),
                                                                                      }
                                                                                  ),
                                                                              !summarized &&
                                                                                  personality.wikipedia &&
                                                                                  (0,
                                                                                  jsx_runtime.jsx)(
                                                                                      "a",
                                                                                      {
                                                                                          style: {
                                                                                              fontWeight:
                                                                                                  "bold",
                                                                                              fontSize:
                                                                                                  "12px",
                                                                                              lineHeight:
                                                                                                  "16px",
                                                                                              color: colors
                                                                                                  .Z
                                                                                                  .bluePrimary,
                                                                                              textDecoration:
                                                                                                  "underline",
                                                                                          },
                                                                                          target: "_blank",
                                                                                          href: personality.wikipedia,
                                                                                          rel: "noreferrer",
                                                                                          children:
                                                                                              t(
                                                                                                  "personality:wikipediaPage"
                                                                                              ),
                                                                                      }
                                                                                  ),
                                                                              !summarized &&
                                                                                  (0,
                                                                                  jsx_runtime.jsx)(
                                                                                      divider.Z,
                                                                                      {
                                                                                          style: {
                                                                                              margin: "16px 0",
                                                                                          },
                                                                                      }
                                                                                  ),
                                                                              enableStats &&
                                                                                  (0,
                                                                                  jsx_runtime.jsx)(
                                                                                      row.Z,
                                                                                      {
                                                                                          children:
                                                                                              !summarized &&
                                                                                              (0,
                                                                                              jsx_runtime.jsxs)(
                                                                                                  row.Z,
                                                                                                  {
                                                                                                      style: {
                                                                                                          flexDirection:
                                                                                                              "column",
                                                                                                          color: colors
                                                                                                              .Z
                                                                                                              .blackPrimary,
                                                                                                          fontSize:
                                                                                                              "16px",
                                                                                                      },
                                                                                                      children:
                                                                                                          [
                                                                                                              void 0 !==
                                                                                                                  (null ==
                                                                                                                      personality ||
                                                                                                                  null ===
                                                                                                                      (_personality$claims =
                                                                                                                          personality.claims) ||
                                                                                                                  void 0 ===
                                                                                                                      _personality$claims
                                                                                                                      ? void 0
                                                                                                                      : _personality$claims.length) &&
                                                                                                                  (0,
                                                                                                                  jsx_runtime.jsx)(
                                                                                                                      "span",
                                                                                                                      {
                                                                                                                          children:
                                                                                                                              t(
                                                                                                                                  "personality:headerClaimsTotal",
                                                                                                                                  {
                                                                                                                                      totalClaims:
                                                                                                                                          personality
                                                                                                                                              .claims
                                                                                                                                              .length,
                                                                                                                                  }
                                                                                                                              ),
                                                                                                                      }
                                                                                                                  ),
                                                                                                              void 0 !==
                                                                                                                  (null ===
                                                                                                                      (_personality$stats3 =
                                                                                                                          personality.stats) ||
                                                                                                                  void 0 ===
                                                                                                                      _personality$stats3
                                                                                                                      ? void 0
                                                                                                                      : _personality$stats3.total) &&
                                                                                                                  (0,
                                                                                                                  jsx_runtime.jsx)(
                                                                                                                      "span",
                                                                                                                      {
                                                                                                                          children:
                                                                                                                              t(
                                                                                                                                  "personality:headerReviewsTotal",
                                                                                                                                  {
                                                                                                                                      totalReviews:
                                                                                                                                          null ===
                                                                                                                                              (_personality$stats4 =
                                                                                                                                                  personality.stats) ||
                                                                                                                                          void 0 ===
                                                                                                                                              _personality$stats4
                                                                                                                                              ? void 0
                                                                                                                                              : _personality$stats4.total,
                                                                                                                                  }
                                                                                                                              ),
                                                                                                                      }
                                                                                                                  ),
                                                                                                          ],
                                                                                                  }
                                                                                              ),
                                                                                      }
                                                                                  ),
                                                                          ],
                                                                  }
                                                              ),
                                                          summarized &&
                                                              (0,
                                                              jsx_runtime.jsx)(
                                                                  col.Z,
                                                                  {
                                                                      span: componentStyle.buttonSpan,
                                                                      style: {
                                                                          display:
                                                                              "flex",
                                                                          justifyContent:
                                                                              "flex-end",
                                                                      },
                                                                      children:
                                                                          personality._id
                                                                              ? (0,
                                                                                jsx_runtime.jsx)(
                                                                                    Button.Z,
                                                                                    Object.assign(
                                                                                        {
                                                                                            type: Button
                                                                                                .L
                                                                                                .blue,
                                                                                            "data-cy":
                                                                                                personality.name,
                                                                                        },
                                                                                        personalityFoundProps,
                                                                                        {
                                                                                            disabled:
                                                                                                isFormSubmitted ||
                                                                                                personalityIsSelected,
                                                                                            style: {
                                                                                                fontSize:
                                                                                                    "12px",
                                                                                                lineHeight:
                                                                                                    "20px",
                                                                                                height: "auto",
                                                                                                padding:
                                                                                                    "4px 12px",
                                                                                            },
                                                                                            children:
                                                                                                (0,
                                                                                                jsx_runtime.jsx)(
                                                                                                    "span",
                                                                                                    {
                                                                                                        style: {
                                                                                                            marginTop: 4,
                                                                                                        },
                                                                                                        children:
                                                                                                            t(
                                                                                                                isCreatingClaim
                                                                                                                    ? "claimForm:personalityFound"
                                                                                                                    : "personality:profile_button"
                                                                                                            ),
                                                                                                    }
                                                                                                ),
                                                                                        }
                                                                                    )
                                                                                )
                                                                              : (0,
                                                                                jsx_runtime.jsxs)(
                                                                                    Button.Z,
                                                                                    {
                                                                                        type: Button
                                                                                            .L
                                                                                            .blue,
                                                                                        onClick:
                                                                                            function onClick() {
                                                                                                isFormSubmitted ||
                                                                                                    _onClick(
                                                                                                        personality
                                                                                                    );
                                                                                            },
                                                                                        disabled:
                                                                                            isFormSubmitted ||
                                                                                            personalityIsSelected,
                                                                                        "data-cy":
                                                                                            personality.name,
                                                                                        style: {
                                                                                            display:
                                                                                                "flex",
                                                                                            justifyContent:
                                                                                                "center",
                                                                                            alignItems:
                                                                                                "center",
                                                                                            height: 40,
                                                                                            paddingBottom: 0,
                                                                                        },
                                                                                        children:
                                                                                            [
                                                                                                (0,
                                                                                                jsx_runtime.jsx)(
                                                                                                    PlusOutlined.Z,
                                                                                                    {}
                                                                                                ),
                                                                                                " ",
                                                                                                t(
                                                                                                    isCreatingClaim
                                                                                                        ? "claimForm:personalityNotFound"
                                                                                                        : "personality:add_button"
                                                                                                ),
                                                                                            ],
                                                                                    }
                                                                                ),
                                                                  }
                                                              ),
                                                      ],
                                                  }
                                              ),
                                          }),
                                          enableStats &&
                                              (0, jsx_runtime.jsx)(col.Z, {
                                                  xs: 24,
                                                  sm: 24,
                                                  md: 24,
                                                  lg:
                                                      header && !mobile
                                                          ? 12
                                                          : 24,
                                                  style: {
                                                      padding: "5px 15px",
                                                      display: "flex",
                                                      alignItems: "center",
                                                  },
                                                  children: (0,
                                                  jsx_runtime.jsx)(row.Z, {
                                                      style: {
                                                          width: "100%",
                                                          justifyContent:
                                                              "space-evenly",
                                                      },
                                                      children: (0,
                                                      jsx_runtime.jsx)(
                                                          ReviewStats.Z,
                                                          {
                                                              stats: personality.stats,
                                                              type: "circle",
                                                              format: "count",
                                                              width:
                                                                  summarized &&
                                                                  30,
                                                              showInfo:
                                                                  !summarized,
                                                              strokeWidth: "16",
                                                          }
                                                      ),
                                                  }),
                                              }),
                                      ],
                                  })
                                : (0, jsx_runtime.jsx)(
                                      Skeleton_PersonalitySkeleton,
                                      {}
                                  )
                        );
                    },
                    Personality_PersonalityCard = PersonalityCard;
                try {
                    (PersonalityCard.displayName = "PersonalityCard"),
                        (PersonalityCard.__docgenInfo = {
                            description: "",
                            displayName: "PersonalityCard",
                            props: {
                                personality: {
                                    defaultValue: null,
                                    description: "",
                                    name: "personality",
                                    required: !0,
                                    type: { name: "any" },
                                },
                                isCreatingClaim: {
                                    defaultValue: null,
                                    description: "",
                                    name: "isCreatingClaim",
                                    required: !1,
                                    type: { name: "boolean" },
                                },
                                summarized: {
                                    defaultValue: { value: "false" },
                                    description: "",
                                    name: "summarized",
                                    required: !1,
                                    type: { name: "boolean" },
                                },
                                enableStats: {
                                    defaultValue: { value: "true" },
                                    description: "",
                                    name: "enableStats",
                                    required: !1,
                                    type: { name: "boolean" },
                                },
                                header: {
                                    defaultValue: { value: "false" },
                                    description: "",
                                    name: "header",
                                    required: !1,
                                    type: { name: "boolean" },
                                },
                                hrefBase: {
                                    defaultValue: { value: "" },
                                    description: "",
                                    name: "hrefBase",
                                    required: !1,
                                    type: { name: "string" },
                                },
                                mobile: {
                                    defaultValue: { value: "false" },
                                    description: "",
                                    name: "mobile",
                                    required: !1,
                                    type: { name: "boolean" },
                                },
                                fullWidth: {
                                    defaultValue: { value: "false" },
                                    description: "",
                                    name: "fullWidth",
                                    required: !1,
                                    type: { name: "boolean" },
                                },
                                hoistAvatar: {
                                    defaultValue: { value: "false" },
                                    description: "",
                                    name: "hoistAvatar",
                                    required: !1,
                                    type: { name: "boolean" },
                                },
                                style: {
                                    defaultValue: null,
                                    description: "",
                                    name: "style",
                                    required: !1,
                                    type: { name: "CSSProperties" },
                                },
                                selectPersonality: {
                                    defaultValue: { value: "null" },
                                    description: "",
                                    name: "selectPersonality",
                                    required: !1,
                                    type: { name: "any" },
                                },
                                isFormSubmitted: {
                                    defaultValue: null,
                                    description: "",
                                    name: "isFormSubmitted",
                                    required: !1,
                                    type: { name: "boolean" },
                                },
                                onClick: {
                                    defaultValue: null,
                                    description: "",
                                    name: "onClick",
                                    required: !1,
                                    type: { name: "any" },
                                },
                                titleLevel: {
                                    defaultValue: { value: "1" },
                                    description: "",
                                    name: "titleLevel",
                                    required: !1,
                                    type: {
                                        name: "enum",
                                        value: [
                                            { value: "1" },
                                            { value: "2" },
                                            { value: "3" },
                                            { value: "4" },
                                            { value: "5" },
                                        ],
                                    },
                                },
                            },
                        }),
                        "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                            (STORYBOOK_REACT_CLASSES[
                                "src/components/Personality/PersonalityCard.tsx#PersonalityCard"
                            ] = {
                                docgenInfo: PersonalityCard.__docgenInfo,
                                name: "PersonalityCard",
                                path: "src/components/Personality/PersonalityCard.tsx#PersonalityCard",
                            });
                } catch (__react_docgen_typescript_loader_error) {}
                var fixtures = __webpack_require__("./src/stories/fixtures.ts"),
                    PersonalityCard_stories =
                        (react.createElement,
                        {
                            title: "Components/Personality/PersonalityCard",
                            component: Personality_PersonalityCard,
                            decorators: [
                                function (Story) {
                                    return (0, jsx_runtime.jsx)("div", {
                                        style: { width: "500px" },
                                        children: (0, jsx_runtime.jsx)(
                                            Story,
                                            {}
                                        ),
                                    });
                                },
                            ],
                            args: {
                                personality: fixtures.Ep,
                                numOfStats: 3,
                                hasClaims: !0,
                            },
                            argTypes: {
                                numOfStats: {
                                    control: {
                                        type: "range",
                                        min: 0,
                                        max: fixtures.xt.length,
                                        step: 1,
                                    },
                                },
                                hasClaims: { control: { type: "boolean" } },
                            },
                        }),
                    Template = function Template(args) {
                        return (
                            args.hasClaims
                                ? ((fixtures.Ep.claims = [fixtures.QS]),
                                  (fixtures.Ep.stats.reviews = (0, fixtures.fy)(
                                      args.numOfStats
                                  )))
                                : ((fixtures.Ep.claims = []),
                                  (fixtures.Ep.stats.reviews = [])),
                            (0, jsx_runtime.jsx)(
                                Personality_PersonalityCard,
                                Object.assign(
                                    { personality: fixtures.Ep },
                                    args
                                )
                            )
                        );
                    };
                Template.displayName = "Template";
                var Default = Template.bind({}),
                    summarized = Template.bind({});
                summarized.args = { summarized: !0 };
                var disableStats = Template.bind({});
                disableStats.args = { enableStats: !1 };
                var allStats = Template.bind({});
                allStats.args = { numOfStats: fixtures.xt.length };
                var sumarizedAllStats = Template.bind({});
                sumarizedAllStats.args = {
                    numOfStats: fixtures.xt.length,
                    summarized: !0,
                };
                var header = Template.bind({});
                (header.args = { summarized: !0, header: !0 }),
                    (Default.parameters = Object.assign(
                        {
                            storySource: {
                                source: "(args) => {\n\n    if (!args.hasClaims) {\n        personality.claims = [];\n        personality.stats.reviews = [];\n    }\n    else {\n        personality.claims = [claim];\n        personality.stats.reviews = getStats(args.numOfStats)\n    }\n\n    return <PersonalityCard personality={personality} {...args} />;\n}",
                            },
                        },
                        Default.parameters
                    )),
                    (summarized.parameters = Object.assign(
                        {
                            storySource: {
                                source: "(args) => {\n\n    if (!args.hasClaims) {\n        personality.claims = [];\n        personality.stats.reviews = [];\n    }\n    else {\n        personality.claims = [claim];\n        personality.stats.reviews = getStats(args.numOfStats)\n    }\n\n    return <PersonalityCard personality={personality} {...args} />;\n}",
                            },
                        },
                        summarized.parameters
                    )),
                    (disableStats.parameters = Object.assign(
                        {
                            storySource: {
                                source: "(args) => {\n\n    if (!args.hasClaims) {\n        personality.claims = [];\n        personality.stats.reviews = [];\n    }\n    else {\n        personality.claims = [claim];\n        personality.stats.reviews = getStats(args.numOfStats)\n    }\n\n    return <PersonalityCard personality={personality} {...args} />;\n}",
                            },
                        },
                        disableStats.parameters
                    )),
                    (allStats.parameters = Object.assign(
                        {
                            storySource: {
                                source: "(args) => {\n\n    if (!args.hasClaims) {\n        personality.claims = [];\n        personality.stats.reviews = [];\n    }\n    else {\n        personality.claims = [claim];\n        personality.stats.reviews = getStats(args.numOfStats)\n    }\n\n    return <PersonalityCard personality={personality} {...args} />;\n}",
                            },
                        },
                        allStats.parameters
                    )),
                    (sumarizedAllStats.parameters = Object.assign(
                        {
                            storySource: {
                                source: "(args) => {\n\n    if (!args.hasClaims) {\n        personality.claims = [];\n        personality.stats.reviews = [];\n    }\n    else {\n        personality.claims = [claim];\n        personality.stats.reviews = getStats(args.numOfStats)\n    }\n\n    return <PersonalityCard personality={personality} {...args} />;\n}",
                            },
                        },
                        sumarizedAllStats.parameters
                    )),
                    (header.parameters = Object.assign(
                        {
                            storySource: {
                                source: "(args) => {\n\n    if (!args.hasClaims) {\n        personality.claims = [];\n        personality.stats.reviews = [];\n    }\n    else {\n        personality.claims = [claim];\n        personality.stats.reviews = getStats(args.numOfStats)\n    }\n\n    return <PersonalityCard personality={personality} {...args} />;\n}",
                            },
                        },
                        header.parameters
                    ));
                var PersonalityCard_stories_namedExportsOrder = [
                    "Default",
                    "summarized",
                    "disableStats",
                    "allStats",
                    "sumarizedAllStats",
                    "header",
                ];
            },
        "./src/stories/components/personality/PersonalityCreateCTA.stories.tsx":
            function (
                __unused_webpack_module,
                __webpack_exports__,
                __webpack_require__
            ) {
                "use strict";
                __webpack_require__.r(__webpack_exports__),
                    __webpack_require__.d(__webpack_exports__, {
                        Default: function () {
                            return Default;
                        },
                        __namedExportsOrder: function () {
                            return __namedExportsOrder;
                        },
                        default: function () {
                            return PersonalityCreateCTA_stories;
                        },
                    });
                var react = __webpack_require__(
                        "./node_modules/react/index.js"
                    ),
                    useTranslation =
                        (__webpack_require__(
                            "./node_modules/core-js/modules/es.object.assign.js"
                        ),
                        __webpack_require__(
                            "./node_modules/react-i18next/dist/es/useTranslation.js"
                        )),
                    Button = __webpack_require__("./src/components/Button.tsx"),
                    PlusOutlined = __webpack_require__(
                        "./node_modules/@ant-design/icons/es/icons/PlusOutlined.js"
                    ),
                    jsx_runtime = __webpack_require__(
                        "./node_modules/react/jsx-runtime.js"
                    ),
                    PersonalityCreateCTA =
                        (react.createElement,
                        function PersonalityCreateCTA(_ref) {
                            var href = _ref.href,
                                t = (0, useTranslation.$)().t;
                            return (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                                children: [
                                    (0, jsx_runtime.jsx)("p", {
                                        children: (0, jsx_runtime.jsx)("b", {
                                            children: t(
                                                "personalityCTA:header"
                                            ),
                                        }),
                                    }),
                                    (0, jsx_runtime.jsx)("p", {
                                        children: (0, jsx_runtime.jsxs)(
                                            Button.Z,
                                            {
                                                type: Button.L.blue,
                                                href: href || "./create",
                                                "data-cy":
                                                    "testButtonCreatePersonality",
                                                children: [
                                                    (0, jsx_runtime.jsx)(
                                                        PlusOutlined.Z,
                                                        {}
                                                    ),
                                                    " ",
                                                    t("personalityCTA:button"),
                                                ],
                                            }
                                        ),
                                    }),
                                    (0, jsx_runtime.jsx)("p", {
                                        children: t("personalityCTA:footer"),
                                    }),
                                ],
                            });
                        }),
                    Personality_PersonalityCreateCTA = PersonalityCreateCTA;
                try {
                    (PersonalityCreateCTA.displayName = "PersonalityCreateCTA"),
                        (PersonalityCreateCTA.__docgenInfo = {
                            description: "",
                            displayName: "PersonalityCreateCTA",
                            props: {
                                href: {
                                    defaultValue: null,
                                    description: "",
                                    name: "href",
                                    required: !0,
                                    type: { name: "any" },
                                },
                            },
                        }),
                        "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                            (STORYBOOK_REACT_CLASSES[
                                "src/components/Personality/PersonalityCreateCTA.tsx#PersonalityCreateCTA"
                            ] = {
                                docgenInfo: PersonalityCreateCTA.__docgenInfo,
                                name: "PersonalityCreateCTA",
                                path: "src/components/Personality/PersonalityCreateCTA.tsx#PersonalityCreateCTA",
                            });
                } catch (__react_docgen_typescript_loader_error) {}
                react.createElement;
                var PersonalityCreateCTA_stories = {
                        title: "Components/Personality/PersonalityCreateCTA",
                        component: Personality_PersonalityCreateCTA,
                        args: { href: "./" },
                    },
                    Template = function Template(args) {
                        return (0, jsx_runtime.jsx)(
                            Personality_PersonalityCreateCTA,
                            Object.assign({}, args)
                        );
                    };
                Template.displayName = "Template";
                var Default = Template.bind({});
                (Default.args = {}),
                    (Default.parameters = Object.assign(
                        {
                            storySource: {
                                source: "(args) => (\n    <PersonalityCreateCTA {...args} />\n)",
                            },
                        },
                        Default.parameters
                    ));
                var __namedExportsOrder = ["Default"];
            },
        "./src/stories/components/sentenceReport/SentenceReportSummary.stories.tsx":
            function (
                __unused_webpack_module,
                __webpack_exports__,
                __webpack_require__
            ) {
                "use strict";
                __webpack_require__.r(__webpack_exports__),
                    __webpack_require__.d(__webpack_exports__, {
                        ClaimReview: function () {
                            return ClaimReview;
                        },
                        Default: function () {
                            return Default;
                        },
                        __namedExportsOrder: function () {
                            return __namedExportsOrder;
                        },
                        default: function () {
                            return SentenceReportSummary_stories;
                        },
                    });
                var react = __webpack_require__(
                        "./node_modules/react/index.js"
                    ),
                    row =
                        (__webpack_require__(
                            "./node_modules/core-js/modules/es.object.assign.js"
                        ),
                        __webpack_require__(
                            "./node_modules/antd/lib/row/style/index.js"
                        ),
                        __webpack_require__(
                            "./node_modules/antd/lib/row/index.js"
                        )),
                    colors = __webpack_require__("./src/styles/colors.ts"),
                    styled_components_browser_esm = __webpack_require__(
                        "./node_modules/styled-components/dist/styled-components.browser.esm.js"
                    ),
                    mediaQueries = __webpack_require__(
                        "./src/styles/mediaQueries.ts"
                    ),
                    SentenceReport_SentenceReportSummary = (0,
                    styled_components_browser_esm.ZP)(row.Z).withConfig({
                        displayName: "SentenceReportSummary",
                        componentId: "sc-8i47r2-0",
                    })(
                        [
                            "position:relative;margin:8px 0 16px 4px;padding:16px 24px;border-radius:10px;background-color:",
                            ';&.after:after{content:" ";position:absolute;left:-12px;top:24px;border-top:none;border-right:9px solid transparent;border-left:9px solid transparent;border-bottom:9px solid ',
                            ";transform:rotate(-90deg);}.sentence-content{font-size:16px;color:",
                            ";margin-bottom:0px;display:flex;flex-direction:column;cite{font-style:normal;}a{color:",
                            ";font-weight:700;margin-left:10px;}}@media ",
                            "{margin-left:0;&.after:after{left:50px;top:-8px;transform:rotate(0deg);}}",
                        ],
                        colors.Z.lightYellow,
                        colors.Z.lightYellow,
                        colors.Z.blackSecondary,
                        colors.Z.bluePrimary,
                        mediaQueries.o$.sm
                    ),
                    jsx_runtime = __webpack_require__(
                        "./node_modules/react/jsx-runtime.js"
                    ),
                    SentenceReportSummary_stories =
                        (react.createElement,
                        {
                            title: "Components/Claim/SentenceReportSummary",
                            component: SentenceReport_SentenceReportSummary,
                            argTypes: { content: { type: "string" } },
                            args: { content: "This is a claim summary" },
                            decorators: [
                                function (Story) {
                                    return (0, jsx_runtime.jsx)("div", {
                                        style: { width: "500px" },
                                        children: (0, jsx_runtime.jsx)(
                                            Story,
                                            {}
                                        ),
                                    });
                                },
                            ],
                        }),
                    Default = function Default(args) {
                        return (0, jsx_runtime.jsx)(
                            SentenceReport_SentenceReportSummary,
                            { children: args.content }
                        );
                    };
                Default.displayName = "Default";
                var ClaimReview = function ClaimReview(args) {
                    return (0, jsx_runtime.jsx)(
                        SentenceReport_SentenceReportSummary,
                        { className: "claim-review", children: args.content }
                    );
                };
                (ClaimReview.displayName = "ClaimReview"),
                    (Default.parameters = Object.assign(
                        {
                            storySource: {
                                source: "(args) => (<SentenceReportSummary>{args.content}</SentenceReportSummary>)",
                            },
                        },
                        Default.parameters
                    )),
                    (ClaimReview.parameters = Object.assign(
                        {
                            storySource: {
                                source: '(args) => (<SentenceReportSummary className="claim-review">{args.content}</SentenceReportSummary>)',
                            },
                        },
                        ClaimReview.parameters
                    ));
                var __namedExportsOrder = ["Default", "ClaimReview"];
                try {
                    (Default.displayName = "Default"),
                        (Default.__docgenInfo = {
                            description: "",
                            displayName: "Default",
                            props: {},
                        }),
                        "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                            (STORYBOOK_REACT_CLASSES[
                                "src/stories/components/sentenceReport/SentenceReportSummary.stories.tsx#Default"
                            ] = {
                                docgenInfo: Default.__docgenInfo,
                                name: "Default",
                                path: "src/stories/components/sentenceReport/SentenceReportSummary.stories.tsx#Default",
                            });
                } catch (__react_docgen_typescript_loader_error) {}
                try {
                    (ClaimReview.displayName = "ClaimReview"),
                        (ClaimReview.__docgenInfo = {
                            description: "",
                            displayName: "ClaimReview",
                            props: {},
                        }),
                        "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                            (STORYBOOK_REACT_CLASSES[
                                "src/stories/components/sentenceReport/SentenceReportSummary.stories.tsx#ClaimReview"
                            ] = {
                                docgenInfo: ClaimReview.__docgenInfo,
                                name: "ClaimReview",
                                path: "src/stories/components/sentenceReport/SentenceReportSummary.stories.tsx#ClaimReview",
                            });
                } catch (__react_docgen_typescript_loader_error) {}
            },
        "./src/stories/components/typography/ClassificationText.stories.tsx":
            function (
                __unused_webpack_module,
                __webpack_exports__,
                __webpack_require__
            ) {
                "use strict";
                __webpack_require__.r(__webpack_exports__),
                    __webpack_require__.d(__webpack_exports__, {
                        Arguable: function () {
                            return Arguable;
                        },
                        Exaggerated: function () {
                            return Exaggerated;
                        },
                        False: function () {
                            return False;
                        },
                        Misleading: function () {
                            return Misleading;
                        },
                        NotFact: function () {
                            return NotFact;
                        },
                        True: function () {
                            return True;
                        },
                        TrueBut: function () {
                            return TrueBut;
                        },
                        Unsustainable: function () {
                            return Unsustainable;
                        },
                        Unverifiable: function () {
                            return Unverifiable;
                        },
                        __namedExportsOrder: function () {
                            return __namedExportsOrder;
                        },
                    });
                __webpack_require__(
                    "./node_modules/core-js/modules/es.object.assign.js"
                );
                var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                        "./node_modules/react/index.js"
                    ),
                    _components_ClassificationText__WEBPACK_IMPORTED_MODULE_2__ =
                        __webpack_require__(
                            "./src/components/ClassificationText.tsx"
                        ),
                    _fixtures__WEBPACK_IMPORTED_MODULE_3__ =
                        __webpack_require__("./src/stories/fixtures.ts"),
                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ =
                        __webpack_require__(
                            "./node_modules/react/jsx-runtime.js"
                        );
                react__WEBPACK_IMPORTED_MODULE_0__.createElement;
                __webpack_exports__.default = {
                    title: "Components/Typography/ClassificationText",
                    component:
                        _components_ClassificationText__WEBPACK_IMPORTED_MODULE_2__.Z,
                    argTypes: {
                        classification: {
                            options: _fixtures__WEBPACK_IMPORTED_MODULE_3__.xt,
                            control: { type: "select" },
                        },
                    },
                };
                var Template = function Template(args) {
                    return (0,
                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(
                        _components_ClassificationText__WEBPACK_IMPORTED_MODULE_2__.Z,
                        Object.assign({}, args)
                    );
                };
                Template.displayName = "Template";
                var True = Template.bind({});
                True.args = { classification: "trustworthy" };
                var TrueBut = Template.bind({});
                TrueBut.args = { classification: "trustworthy-but" };
                var Arguable = Template.bind({});
                Arguable.args = { classification: "arguable" };
                var Misleading = Template.bind({});
                Misleading.args = { classification: "misleading" };
                var False = Template.bind({});
                False.args = { classification: "false" };
                var Unsustainable = Template.bind({});
                Unsustainable.args = { classification: "unsustainable" };
                var Exaggerated = Template.bind({});
                Exaggerated.args = { classification: "exaggerated" };
                var NotFact = Template.bind({});
                NotFact.args = { classification: "not-fact" };
                var Unverifiable = Template.bind({});
                (Unverifiable.args = { classification: "unverifiable" }),
                    (True.parameters = Object.assign(
                        {
                            storySource: {
                                source: "(args) => (\n    <ClassificationText {...args} />\n)",
                            },
                        },
                        True.parameters
                    )),
                    (TrueBut.parameters = Object.assign(
                        {
                            storySource: {
                                source: "(args) => (\n    <ClassificationText {...args} />\n)",
                            },
                        },
                        TrueBut.parameters
                    )),
                    (Arguable.parameters = Object.assign(
                        {
                            storySource: {
                                source: "(args) => (\n    <ClassificationText {...args} />\n)",
                            },
                        },
                        Arguable.parameters
                    )),
                    (Misleading.parameters = Object.assign(
                        {
                            storySource: {
                                source: "(args) => (\n    <ClassificationText {...args} />\n)",
                            },
                        },
                        Misleading.parameters
                    )),
                    (False.parameters = Object.assign(
                        {
                            storySource: {
                                source: "(args) => (\n    <ClassificationText {...args} />\n)",
                            },
                        },
                        False.parameters
                    )),
                    (Unsustainable.parameters = Object.assign(
                        {
                            storySource: {
                                source: "(args) => (\n    <ClassificationText {...args} />\n)",
                            },
                        },
                        Unsustainable.parameters
                    )),
                    (Exaggerated.parameters = Object.assign(
                        {
                            storySource: {
                                source: "(args) => (\n    <ClassificationText {...args} />\n)",
                            },
                        },
                        Exaggerated.parameters
                    )),
                    (NotFact.parameters = Object.assign(
                        {
                            storySource: {
                                source: "(args) => (\n    <ClassificationText {...args} />\n)",
                            },
                        },
                        NotFact.parameters
                    )),
                    (Unverifiable.parameters = Object.assign(
                        {
                            storySource: {
                                source: "(args) => (\n    <ClassificationText {...args} />\n)",
                            },
                        },
                        Unverifiable.parameters
                    ));
                var __namedExportsOrder = [
                    "True",
                    "TrueBut",
                    "Arguable",
                    "Misleading",
                    "False",
                    "Unsustainable",
                    "Exaggerated",
                    "NotFact",
                    "Unverifiable",
                ];
            },
        "./src/stories/components/typography/HighlightedSearchText.stories.tsx":
            function (
                __unused_webpack_module,
                __webpack_exports__,
                __webpack_require__
            ) {
                "use strict";
                __webpack_require__.r(__webpack_exports__),
                    __webpack_require__.d(__webpack_exports__, {
                        Default: function () {
                            return Default;
                        },
                        __namedExportsOrder: function () {
                            return __namedExportsOrder;
                        },
                        default: function () {
                            return HighlightedSearchText_stories;
                        },
                    });
                var react = __webpack_require__(
                        "./node_modules/react/index.js"
                    ),
                    jsx_runtime =
                        (__webpack_require__(
                            "./node_modules/core-js/modules/es.object.assign.js"
                        ),
                        __webpack_require__(
                            "./node_modules/core-js/modules/es.string.trim.js"
                        ),
                        __webpack_require__(
                            "./node_modules/core-js/modules/es.regexp.constructor.js"
                        ),
                        __webpack_require__(
                            "./node_modules/core-js/modules/es.regexp.exec.js"
                        ),
                        __webpack_require__(
                            "./node_modules/core-js/modules/es.regexp.to-string.js"
                        ),
                        __webpack_require__(
                            "./node_modules/core-js/modules/es.string.split.js"
                        ),
                        __webpack_require__(
                            "./node_modules/core-js/modules/es.array.map.js"
                        ),
                        __webpack_require__(
                            "./node_modules/core-js/modules/es.array.filter.js"
                        ),
                        __webpack_require__(
                            "./node_modules/react/jsx-runtime.js"
                        )),
                    HighlightedSearchText =
                        (react.createElement,
                        function HighlightedSearchText(_ref) {
                            var _ref$text = _ref.text,
                                text = void 0 === _ref$text ? "" : _ref$text,
                                _ref$highlight = _ref.highlight,
                                highlight =
                                    void 0 === _ref$highlight
                                        ? ""
                                        : _ref$highlight;
                            if (null == highlight || !highlight.trim())
                                return (0, jsx_runtime.jsx)("span", {
                                    children: text,
                                });
                            var pattern = new RegExp(
                                    "(" + highlight + ")",
                                    "gi"
                                ),
                                parts = text.split(pattern);
                            return (0, jsx_runtime.jsx)("span", {
                                children: parts
                                    .filter(function (part) {
                                        return part;
                                    })
                                    .map(function (part, i) {
                                        return pattern.test(part)
                                            ? (0, jsx_runtime.jsx)(
                                                  "strong",
                                                  { children: part },
                                                  i
                                              )
                                            : (0, jsx_runtime.jsx)(
                                                  "span",
                                                  { children: part },
                                                  i
                                              );
                                    }),
                            });
                        });
                HighlightedSearchText.displayName = "HighlightedSearchText";
                var components_HighlightedSearchText = HighlightedSearchText;
                try {
                    (HighlightedSearchText.displayName =
                        "HighlightedSearchText"),
                        (HighlightedSearchText.__docgenInfo = {
                            description: "",
                            displayName: "HighlightedSearchText",
                            props: {
                                text: {
                                    defaultValue: { value: "" },
                                    description: "",
                                    name: "text",
                                    required: !1,
                                    type: { name: "string" },
                                },
                                highlight: {
                                    defaultValue: { value: "" },
                                    description: "",
                                    name: "highlight",
                                    required: !1,
                                    type: { name: "string" },
                                },
                            },
                        }),
                        "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                            (STORYBOOK_REACT_CLASSES[
                                "src/components/HighlightedSearchText.tsx#HighlightedSearchText"
                            ] = {
                                docgenInfo: HighlightedSearchText.__docgenInfo,
                                name: "HighlightedSearchText",
                                path: "src/components/HighlightedSearchText.tsx#HighlightedSearchText",
                            });
                } catch (__react_docgen_typescript_loader_error) {}
                react.createElement;
                var HighlightedSearchText_stories = {
                        title: "Components/Typography/HighlightedSearchText",
                        component: components_HighlightedSearchText,
                        decorators: [
                            function (Story) {
                                return (0, jsx_runtime.jsx)("div", {
                                    style: { width: "500px" },
                                    children: (0, jsx_runtime.jsx)(Story, {}),
                                });
                            },
                        ],
                    },
                    Template = function Template(args) {
                        return (0, jsx_runtime.jsx)(
                            components_HighlightedSearchText,
                            Object.assign({}, args)
                        );
                    };
                Template.displayName = "Template";
                var Default = Template.bind({});
                (Default.args = {
                    text: "This is a test string",
                    highlight: "test",
                }),
                    (Default.parameters = Object.assign(
                        {
                            storySource: {
                                source: "(args) => (\n    <HighlightedSearchText {...args} />\n)",
                            },
                        },
                        Default.parameters
                    ));
                var __namedExportsOrder = ["Default"];
            },
        "./src/stories/components/typography/Label.stories.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__),
                __webpack_require__.d(__webpack_exports__, {
                    Default: function () {
                        return Default;
                    },
                    WithInput: function () {
                        return WithInput;
                    },
                    __namedExportsOrder: function () {
                        return __namedExportsOrder;
                    },
                    default: function () {
                        return Label_stories;
                    },
                });
            __webpack_require__("./node_modules/antd/lib/form/style/index.js");
            var lib_form = __webpack_require__(
                    "./node_modules/antd/lib/form/index.js"
                ),
                react = __webpack_require__("./node_modules/react/index.js"),
                AletheiaInput =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/es.object.assign.js"
                    ),
                    __webpack_require__("./src/components/AletheiaInput.tsx")),
                typography =
                    (__webpack_require__(
                        "./node_modules/antd/lib/typography/style/index.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/typography/index.js"
                    )),
                colors = __webpack_require__("./src/styles/colors.ts"),
                jsx_runtime = __webpack_require__(
                    "./node_modules/react/jsx-runtime.js"
                ),
                Text = (react.createElement, typography.Z.Text),
                Label = function Label(_ref) {
                    var children = _ref.children,
                        _ref$required = _ref.required,
                        required = void 0 !== _ref$required && _ref$required;
                    return (0, jsx_runtime.jsxs)("span", {
                        style: { color: colors.Z.redText },
                        children: [
                            required && "* ",
                            (0, jsx_runtime.jsx)(Text, {
                                strong: !0,
                                style: { color: colors.Z.blackSecondary },
                                children: children,
                            }),
                        ],
                    });
                };
            Label.displayName = "Label";
            var components_Label = Label;
            try {
                (Label.displayName = "Label"),
                    (Label.__docgenInfo = {
                        description: "",
                        displayName: "Label",
                        props: {
                            required: {
                                defaultValue: { value: "false" },
                                description: "",
                                name: "required",
                                required: !1,
                                type: { name: "boolean" },
                            },
                        },
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/Label.tsx#Label"
                        ] = {
                            docgenInfo: Label.__docgenInfo,
                            name: "Label",
                            path: "src/components/Label.tsx#Label",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
            react.createElement;
            var Label_stories = {
                    title: "Components/Typography/Label",
                    component: components_Label,
                    decorators: [
                        function (Story) {
                            return (0, jsx_runtime.jsx)("div", {
                                style: { width: "500px" },
                                children: (0, jsx_runtime.jsx)(Story, {}),
                            });
                        },
                    ],
                    args: { children: "Label" },
                },
                Default = function Default(args) {
                    return (0, jsx_runtime.jsx)(components_Label, {
                        children: args.children,
                    });
                };
            Default.displayName = "Default";
            var TemplateWithInput = function TemplateWithInput(args) {
                return (0, jsx_runtime.jsx)(lib_form.Z.Item, {
                    label: (0, jsx_runtime.jsx)(components_Label, {
                        children: args.children,
                    }),
                    children: (0, jsx_runtime.jsx)(AletheiaInput.Z, {
                        placeholder: args.inputPlaceholder,
                    }),
                });
            };
            TemplateWithInput.displayName = "TemplateWithInput";
            var WithInput = TemplateWithInput.bind({});
            (WithInput.args = {
                children: "Label",
                inputPlaceholder: "Input placeholder",
            }),
                (Default.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => (\n    <Label>{args.children}</Label>\n)",
                        },
                    },
                    Default.parameters
                )),
                (WithInput.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => (\n    <Form.Item\n        label={\n            <Label>\n                {args.children}\n            </Label>\n        }\n    >\n        <AletheiaInput\n            placeholder={args.inputPlaceholder}\n        />\n    </Form.Item>\n)",
                        },
                    },
                    WithInput.parameters
                ));
            var __namedExportsOrder = ["Default", "WithInput"];
        },
        "./src/stories/components/typography/LocalizedDate.stories.tsx":
            function (
                __unused_webpack_module,
                __webpack_exports__,
                __webpack_require__
            ) {
                "use strict";
                __webpack_require__.r(__webpack_exports__),
                    __webpack_require__.d(__webpack_exports__, {
                        Default: function () {
                            return Default;
                        },
                        WithTime: function () {
                            return WithTime;
                        },
                        __namedExportsOrder: function () {
                            return __namedExportsOrder;
                        },
                    });
                var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                        "./node_modules/react/index.js"
                    ),
                    _components_LocalizedDate__WEBPACK_IMPORTED_MODULE_2__ =
                        (__webpack_require__(
                            "./node_modules/core-js/modules/es.object.assign.js"
                        ),
                        __webpack_require__(
                            "./src/components/LocalizedDate.tsx"
                        )),
                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ =
                        __webpack_require__(
                            "./node_modules/react/jsx-runtime.js"
                        );
                react__WEBPACK_IMPORTED_MODULE_0__.createElement;
                __webpack_exports__.default = {
                    title: "Components/Typography/LocalizedDate",
                    component:
                        _components_LocalizedDate__WEBPACK_IMPORTED_MODULE_2__.Z,
                    argTypes: { date: { control: { type: "date" } } },
                };
                var today = new Date(),
                    Template = function Template(args) {
                        return (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(
                            _components_LocalizedDate__WEBPACK_IMPORTED_MODULE_2__.Z,
                            Object.assign({}, args)
                        );
                    };
                Template.displayName = "Template";
                var Default = Template.bind({});
                Default.args = { date: today, showTime: !1 };
                var WithTime = Template.bind({});
                (WithTime.args = { date: today, showTime: !0 }),
                    (Default.parameters = Object.assign(
                        {
                            storySource: {
                                source: "(args) => (\n    <LocalizedDate {...args} />\n)",
                            },
                        },
                        Default.parameters
                    )),
                    (WithTime.parameters = Object.assign(
                        {
                            storySource: {
                                source: "(args) => (\n    <LocalizedDate {...args} />\n)",
                            },
                        },
                        WithTime.parameters
                    ));
                var __namedExportsOrder = ["Default", "WithTime"];
            },
        "./src/stories/components/typography/Subtitle.stories.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.r(__webpack_exports__),
                __webpack_require__.d(__webpack_exports__, {
                    Comparison: function () {
                        return Comparison;
                    },
                    Default: function () {
                        return Default;
                    },
                    __namedExportsOrder: function () {
                        return __namedExportsOrder;
                    },
                    default: function () {
                        return Subtitle_stories;
                    },
                });
            __webpack_require__(
                "./node_modules/antd/lib/typography/style/index.js"
            );
            var typography = __webpack_require__(
                    "./node_modules/antd/lib/typography/index.js"
                ),
                react = __webpack_require__("./node_modules/react/index.js"),
                jsx_runtime =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/es.object.assign.js"
                    ),
                    __webpack_require__("./node_modules/react/jsx-runtime.js")),
                Paragraph =
                    (react.createElement,
                    function Paragraph(props) {
                        return (0, jsx_runtime.jsx)("p", {
                            style: { width: "100%" },
                            children: props.children,
                        });
                    });
            Paragraph.displayName = "Paragraph";
            var components_Paragraph = Paragraph;
            try {
                (Paragraph.displayName = "Paragraph"),
                    (Paragraph.__docgenInfo = {
                        description: "",
                        displayName: "Paragraph",
                        props: {},
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/Paragraph.tsx#Paragraph"
                        ] = {
                            docgenInfo: Paragraph.__docgenInfo,
                            name: "Paragraph",
                            path: "src/components/Paragraph.tsx#Paragraph",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
            react.createElement;
            var Title = typography.Z.Title,
                Subtitle = function Subtitle(props) {
                    return (0, jsx_runtime.jsx)(Title, {
                        level: 2,
                        style: Object.assign(
                            { fontWeight: 600, fontSize: 24, lineHeight: 1.35 },
                            props.style
                        ),
                        children: props.children,
                    });
                };
            Subtitle.displayName = "Subtitle";
            var components_Subtitle = Subtitle;
            try {
                (Subtitle.displayName = "Subtitle"),
                    (Subtitle.__docgenInfo = {
                        description: "",
                        displayName: "Subtitle",
                        props: {},
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/Subtitle.tsx#Subtitle"
                        ] = {
                            docgenInfo: Subtitle.__docgenInfo,
                            name: "Subtitle",
                            path: "src/components/Subtitle.tsx#Subtitle",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
            react.createElement;
            var Subtitle_stories = {
                    title: "Components/Typography/Subtitle",
                    component: components_Subtitle,
                    decorators: [
                        function (Story) {
                            return (0, jsx_runtime.jsx)("div", {
                                style: { width: "500px" },
                                children: (0, jsx_runtime.jsx)(Story, {}),
                            });
                        },
                    ],
                },
                Template = function Template(args) {
                    return (0, jsx_runtime.jsx)(components_Subtitle, {
                        children: args.subtitle,
                    });
                };
            Template.displayName = "Template";
            var Default = Template.bind({});
            Default.args = { subtitle: "Subtitle" };
            var Comparison = function ComparisonTemplate(args) {
                return (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                    children: [
                        (0, jsx_runtime.jsx)(typography.Z.Title, {
                            children: args.title,
                        }),
                        (0, jsx_runtime.jsx)(components_Subtitle, {
                            children: args.subtitle,
                        }),
                        (0, jsx_runtime.jsx)(components_Paragraph, {
                            children: args.paragraph,
                        }),
                    ],
                });
            }.bind({});
            (Comparison.args = {
                title: "Title",
                subtitle: "Subtitle",
                paragraph: "Paragraph",
            }),
                (Default.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => (\n    <Subtitle>{args.subtitle}</Subtitle>\n)",
                        },
                    },
                    Default.parameters
                )),
                (Comparison.parameters = Object.assign(
                    {
                        storySource: {
                            source: "(args) => (\n    <>\n        <Typography.Title>{args.title}</Typography.Title>\n        <Subtitle>{args.subtitle}</Subtitle>\n        <Paragraph>{args.paragraph}</Paragraph>\n    </>\n)",
                        },
                    },
                    Comparison.parameters
                ));
            var __namedExportsOrder = ["Default", "Comparison"];
        },
        "./src/atoms/currentUser.ts": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, {
                Pc: function () {
                    return isUserLoggedIn;
                },
                gJ: function () {
                    return currentUserRole;
                },
            });
            var jotai__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                    "./node_modules/jotai/esm/index.mjs"
                ),
                _types_enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    "./src/types/enums.ts"
                ),
                isUserLoggedIn = (0, jotai__WEBPACK_IMPORTED_MODULE_1__.cn)(!1),
                currentUserRole = (0, jotai__WEBPACK_IMPORTED_MODULE_1__.cn)(
                    _types_enums__WEBPACK_IMPORTED_MODULE_0__.G7.Regular
                );
            (0, jotai__WEBPACK_IMPORTED_MODULE_1__.cn)("");
        },
        "./src/components/AletheiaInput.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            var styled_components__WEBPACK_IMPORTED_MODULE_1__ =
                    __webpack_require__(
                        "./node_modules/styled-components/dist/styled-components.browser.esm.js"
                    ),
                _styles_colors__WEBPACK_IMPORTED_MODULE_0__ =
                    __webpack_require__("./src/styles/colors.ts"),
                AletheiaInput =
                    styled_components__WEBPACK_IMPORTED_MODULE_1__.ZP.input.withConfig(
                        {
                            displayName: "AletheiaInput",
                            componentId: "sc-1211bps-0",
                        }
                    )(
                        [
                            "background:",
                            ";box-shadow:0px 2px 2px rgba(0,0,0,0.25);border-radius:4px;border:none;height:40px;width:100%;padding:10px;::placeholder{color:#515151;}:focus{border:none;box-shadow:0px 2px 2px rgba(0,0,0,0.25);}:active{border:none;}:hover{border:none;}:focus-visible{outline:none;}",
                        ],
                        function (props) {
                            return props.white
                                ? _styles_colors__WEBPACK_IMPORTED_MODULE_0__.Z
                                      .white
                                : _styles_colors__WEBPACK_IMPORTED_MODULE_0__.Z
                                      .lightGray;
                        }
                    );
            __webpack_exports__.Z = AletheiaInput;
        },
        "./src/components/AletheiaMenu.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__("./node_modules/antd/lib/menu/style/index.js");
            var antd_lib_menu__WEBPACK_IMPORTED_MODULE_12__ =
                    __webpack_require__(
                        "./node_modules/antd/lib/menu/index.js"
                    ),
                _Users_mateus_wmf_workspace_aletheia_fact_aletheia_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_11__ =
                    __webpack_require__(
                        "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js"
                    ),
                jotai__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
                    "./node_modules/jotai/esm/index.mjs"
                ),
                next_i18next__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
                    "./node_modules/react-i18next/dist/es/useTranslation.js"
                ),
                next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
                    "./node_modules/next/router.js"
                ),
                react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                    "./node_modules/react/index.js"
                ),
                react_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
                    "./node_modules/react-redux/es/index.js"
                ),
                _atoms_currentUser__WEBPACK_IMPORTED_MODULE_4__ =
                    __webpack_require__("./src/atoms/currentUser.ts"),
                _store_actions__WEBPACK_IMPORTED_MODULE_5__ =
                    __webpack_require__("./src/store/actions.ts"),
                _styles_colors__WEBPACK_IMPORTED_MODULE_6__ =
                    __webpack_require__("./src/styles/colors.ts"),
                _types_enums__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
                    "./src/types/enums.ts"
                ),
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ =
                    __webpack_require__("./node_modules/react/jsx-runtime.js"),
                AletheiaMenu =
                    (react__WEBPACK_IMPORTED_MODULE_1__.createElement,
                    function AletheiaMenu() {
                        var t = (0,
                            next_i18next__WEBPACK_IMPORTED_MODULE_9__.$)().t,
                            dispatch = (0,
                            react_redux__WEBPACK_IMPORTED_MODULE_3__.I0)(),
                            router = (0,
                            next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)(),
                            handleClick = function handleClick(menuItem) {
                                dispatch(
                                    _store_actions__WEBPACK_IMPORTED_MODULE_5__.Z.openSideMenu()
                                ),
                                    router.push(menuItem.key);
                            },
                            _useAtom = (0,
                            jotai__WEBPACK_IMPORTED_MODULE_10__.KO)(
                                _atoms_currentUser__WEBPACK_IMPORTED_MODULE_4__.gJ
                            ),
                            role = (0,
                            _Users_mateus_wmf_workspace_aletheia_fact_aletheia_node_modules_babel_runtime_helpers_esm_slicedToArray__WEBPACK_IMPORTED_MODULE_11__.Z)(
                                _useAtom,
                                1
                            )[0];
                        return (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(
                            antd_lib_menu__WEBPACK_IMPORTED_MODULE_12__.Z,
                            {
                                mode: "inline",
                                theme: "light",
                                style: {
                                    backgroundColor:
                                        _styles_colors__WEBPACK_IMPORTED_MODULE_6__
                                            .Z.lightGray,
                                    color: _styles_colors__WEBPACK_IMPORTED_MODULE_6__
                                        .Z.blackPrimary,
                                    fontSize: "16px",
                                    padding: "0px 24px",
                                },
                                selectable: !1,
                                children: [
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(
                                        antd_lib_menu__WEBPACK_IMPORTED_MODULE_12__
                                            .Z.Item,
                                        {
                                            "data-cy": "testAboutItem",
                                            onClick: handleClick,
                                            children: t("menu:aboutItem"),
                                        },
                                        "/about"
                                    ),
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(
                                        antd_lib_menu__WEBPACK_IMPORTED_MODULE_12__
                                            .Z.Item,
                                        {
                                            "data-cy": "testPrivacyPolicyItem",
                                            onClick: handleClick,
                                            children: t(
                                                "menu:privacyPolicyItem"
                                            ),
                                        },
                                        "/privacy-policy"
                                    ),
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(
                                        antd_lib_menu__WEBPACK_IMPORTED_MODULE_12__
                                            .Z.Item,
                                        {
                                            "data-cy": "testCodeOfConductItem",
                                            onClick: handleClick,
                                            children: t(
                                                "menu:codeOfConductItem"
                                            ),
                                        },
                                        "/code-of-conduct"
                                    ),
                                    role ===
                                        _types_enums__WEBPACK_IMPORTED_MODULE_7__
                                            .G7.Admin &&
                                        (0,
                                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(
                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment,
                                            {
                                                children: [
                                                    (0,
                                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(
                                                        antd_lib_menu__WEBPACK_IMPORTED_MODULE_12__
                                                            .Z.Item,
                                                        {
                                                            "data-cy":
                                                                "testadminItem",
                                                            onClick:
                                                                handleClick,
                                                            children:
                                                                t(
                                                                    "menu:adminItem"
                                                                ),
                                                        },
                                                        "/admin"
                                                    ),
                                                    (0,
                                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(
                                                        antd_lib_menu__WEBPACK_IMPORTED_MODULE_12__
                                                            .Z.Item,
                                                        {
                                                            "data-cy":
                                                                "testadminBadgeItem",
                                                            onClick:
                                                                handleClick,
                                                            children:
                                                                t(
                                                                    "menu:Badges"
                                                                ),
                                                        },
                                                        "/admin/badges"
                                                    ),
                                                ],
                                            }
                                        ),
                                ],
                            }
                        );
                    });
            (AletheiaMenu.displayName = "AletheiaMenu"),
                (__webpack_exports__.Z = AletheiaMenu);
        },
        "./src/components/Button.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, {
                L: function () {
                    return ButtonType;
                },
            });
            __webpack_require__(
                "./node_modules/antd/lib/button/style/index.js"
            );
            var ButtonType,
                antd_lib_button__WEBPACK_IMPORTED_MODULE_5__ =
                    __webpack_require__(
                        "./node_modules/antd/lib/button/index.js"
                    ),
                react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                    "./node_modules/react/index.js"
                ),
                _styles_colors__WEBPACK_IMPORTED_MODULE_3__ =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/es.object.assign.js"
                    ),
                    __webpack_require__("./src/styles/colors.ts")),
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ =
                    __webpack_require__("./node_modules/react/jsx-runtime.js");
            react__WEBPACK_IMPORTED_MODULE_1__.createElement;
            !(function (ButtonType) {
                (ButtonType.blue = "blue"),
                    (ButtonType.white = "white"),
                    (ButtonType.gray = "gray"),
                    (ButtonType.whiteBlue = "whiteBlue"),
                    (ButtonType.whiteBlack = "whiteBlack");
            })(ButtonType || (ButtonType = {}));
            var AletheiaButton = function AletheiaButton(props) {
                var buttonStyle = Object.assign(
                    {
                        borderWidth: "2px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: 40,
                        paddingBottom: 0,
                        borderRadius: props.rounded ? "30px" : "4px",
                    },
                    props.style
                );
                switch (props.type) {
                    case ButtonType.white:
                        buttonStyle = Object.assign({}, buttonStyle, {
                            background:
                                _styles_colors__WEBPACK_IMPORTED_MODULE_3__.Z
                                    .white,
                            borderColor:
                                _styles_colors__WEBPACK_IMPORTED_MODULE_3__.Z
                                    .white,
                            color: _styles_colors__WEBPACK_IMPORTED_MODULE_3__.Z
                                .bluePrimary,
                        });
                        break;
                    case ButtonType.gray:
                        buttonStyle = Object.assign({}, buttonStyle, {
                            background:
                                _styles_colors__WEBPACK_IMPORTED_MODULE_3__.Z
                                    .lightGray,
                            borderColor:
                                _styles_colors__WEBPACK_IMPORTED_MODULE_3__.Z
                                    .lightGray,
                            color: _styles_colors__WEBPACK_IMPORTED_MODULE_3__.Z
                                .bluePrimary,
                        });
                        break;
                    case ButtonType.whiteBlue:
                        buttonStyle = Object.assign({}, buttonStyle, {
                            background:
                                _styles_colors__WEBPACK_IMPORTED_MODULE_3__.Z
                                    .bluePrimary,
                            borderColor:
                                _styles_colors__WEBPACK_IMPORTED_MODULE_3__.Z
                                    .white,
                            color: _styles_colors__WEBPACK_IMPORTED_MODULE_3__.Z
                                .white,
                        });
                        break;
                    case ButtonType.whiteBlack:
                        buttonStyle = Object.assign({}, buttonStyle, {
                            background:
                                _styles_colors__WEBPACK_IMPORTED_MODULE_3__.Z
                                    .white,
                            borderColor:
                                _styles_colors__WEBPACK_IMPORTED_MODULE_3__.Z
                                    .blackSecondary,
                            color: _styles_colors__WEBPACK_IMPORTED_MODULE_3__.Z
                                .blackSecondary,
                        });
                        break;
                    case ButtonType.blue:
                    default:
                        buttonStyle = Object.assign({}, buttonStyle, {
                            background:
                                _styles_colors__WEBPACK_IMPORTED_MODULE_3__.Z
                                    .bluePrimary,
                            borderColor:
                                _styles_colors__WEBPACK_IMPORTED_MODULE_3__.Z
                                    .bluePrimary,
                            color: _styles_colors__WEBPACK_IMPORTED_MODULE_3__.Z
                                .white,
                        });
                }
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(
                    antd_lib_button__WEBPACK_IMPORTED_MODULE_5__.default,
                    Object.assign({}, props, {
                        type: "default",
                        style: buttonStyle,
                        children: props.children,
                    })
                );
            };
            (AletheiaButton.displayName = "AletheiaButton"),
                (__webpack_exports__.Z = AletheiaButton);
        },
        "./src/components/CardBase.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__("./node_modules/antd/lib/row/style/index.js");
            var antd_lib_row__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
                    "./node_modules/antd/lib/row/index.js"
                ),
                react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                    "./node_modules/react/index.js"
                ),
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/es.object.assign.js"
                    ),
                    __webpack_require__("./node_modules/react/jsx-runtime.js")),
                CardBase =
                    (react__WEBPACK_IMPORTED_MODULE_1__.createElement,
                    function CardBase(_ref) {
                        var children = _ref.children,
                            _ref$style = _ref.style,
                            style = void 0 === _ref$style ? {} : _ref$style;
                        return (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(
                            antd_lib_row__WEBPACK_IMPORTED_MODULE_4__.Z,
                            {
                                style: Object.assign(
                                    {
                                        background: "#FFFFFF",
                                        border: "1px solid #EEEEEE",
                                        boxSizing: "border-box",
                                        boxShadow:
                                            "0px 3px 3px rgba(0, 0, 0, 0.2)",
                                        borderRadius: "10px",
                                        marginBottom: "10px",
                                    },
                                    style
                                ),
                                children: children,
                            }
                        );
                    });
            (CardBase.displayName = "CardBase"),
                (__webpack_exports__.Z = CardBase);
            try {
                (CardBase.displayName = "CardBase"),
                    (CardBase.__docgenInfo = {
                        description: "",
                        displayName: "CardBase",
                        props: {
                            style: {
                                defaultValue: { value: "{}" },
                                description: "",
                                name: "style",
                                required: !1,
                                type: { name: "{}" },
                            },
                        },
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/CardBase.tsx#CardBase"
                        ] = {
                            docgenInfo: CardBase.__docgenInfo,
                            name: "CardBase",
                            path: "src/components/CardBase.tsx#CardBase",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
        },
        "./src/components/Claim/ClaimCardHeader.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__("./node_modules/antd/lib/col/style/index.js");
            var antd_lib_col__WEBPACK_IMPORTED_MODULE_12__ =
                    __webpack_require__("./node_modules/antd/lib/col/index.js"),
                antd_lib_row__WEBPACK_IMPORTED_MODULE_13__ =
                    (__webpack_require__(
                        "./node_modules/antd/lib/row/style/index.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/row/index.js"
                    )),
                antd_lib_typography__WEBPACK_IMPORTED_MODULE_10__ =
                    (__webpack_require__(
                        "./node_modules/antd/lib/typography/style/index.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/typography/index.js"
                    )),
                next_i18next__WEBPACK_IMPORTED_MODULE_11__ =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/es.symbol.js"
                    ),
                    __webpack_require__(
                        "./node_modules/core-js/modules/es.symbol.description.js"
                    ),
                    __webpack_require__(
                        "./node_modules/react-i18next/dist/es/useTranslation.js"
                    )),
                react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
                    "./node_modules/react/index.js"
                ),
                _styles_colors__WEBPACK_IMPORTED_MODULE_6__ =
                    __webpack_require__("./src/styles/colors.ts"),
                _types_enums__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
                    "./src/types/enums.ts"
                ),
                _LocalizedDate__WEBPACK_IMPORTED_MODULE_8__ =
                    __webpack_require__("./src/components/LocalizedDate.tsx"),
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ =
                    __webpack_require__("./node_modules/react/jsx-runtime.js"),
                Paragraph =
                    (react__WEBPACK_IMPORTED_MODULE_3__.createElement,
                    antd_lib_typography__WEBPACK_IMPORTED_MODULE_10__.Z
                        .Paragraph),
                ClaimCardHeader = function ClaimCardHeader(_ref) {
                    var _speechTypeMapping,
                        personality = _ref.personality,
                        date = _ref.date,
                        _ref$claimType = _ref.claimType,
                        claimType =
                            void 0 === _ref$claimType
                                ? _types_enums__WEBPACK_IMPORTED_MODULE_7__.BN
                                      .Speech
                                : _ref$claimType,
                        t = (0, next_i18next__WEBPACK_IMPORTED_MODULE_11__.$)()
                            .t,
                        isImage =
                            claimType ===
                            _types_enums__WEBPACK_IMPORTED_MODULE_7__.BN.Image,
                        speechTypeTranslation = (((_speechTypeMapping = {})[
                            _types_enums__WEBPACK_IMPORTED_MODULE_7__.BN.Speech
                        ] = t("claim:typeSpeech")),
                        (_speechTypeMapping[
                            _types_enums__WEBPACK_IMPORTED_MODULE_7__.BN.Image
                        ] = t("claim:typeImage")),
                        (_speechTypeMapping[
                            _types_enums__WEBPACK_IMPORTED_MODULE_7__.BN.Debate
                        ] = t("claim:typeDebate")),
                        _speechTypeMapping)[claimType];
                    return (0,
                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(
                        antd_lib_col__WEBPACK_IMPORTED_MODULE_12__.Z,
                        {
                            span: 24,
                            style: {
                                color: _styles_colors__WEBPACK_IMPORTED_MODULE_6__
                                    .Z.blackSecondary,
                                width: "100%",
                            },
                            children: [
                                personality &&
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(
                                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.Fragment,
                                        {
                                            children: [
                                                (0,
                                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(
                                                    Paragraph,
                                                    {
                                                        style: {
                                                            fontSize: "14px",
                                                            lineHeight: "20px",
                                                            fontWeight: 600,
                                                            marginBottom: 0,
                                                            color: _styles_colors__WEBPACK_IMPORTED_MODULE_6__
                                                                .Z.blackPrimary,
                                                        },
                                                        children:
                                                            personality.name,
                                                    }
                                                ),
                                                (0,
                                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(
                                                    antd_lib_row__WEBPACK_IMPORTED_MODULE_13__.Z,
                                                    {
                                                        children: (0,
                                                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(
                                                            Paragraph,
                                                            {
                                                                style: {
                                                                    fontSize: 10,
                                                                    fontWeight: 400,
                                                                    lineHeight:
                                                                        "18px",
                                                                    marginBottom: 0,
                                                                },
                                                                children:
                                                                    personality.description,
                                                            }
                                                        ),
                                                    }
                                                ),
                                            ],
                                        }
                                    ),
                                (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(
                                    antd_lib_row__WEBPACK_IMPORTED_MODULE_13__.Z,
                                    {
                                        children: isImage
                                            ? (0,
                                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(
                                                  Paragraph,
                                                  {
                                                      style: {
                                                          fontSize: 10,
                                                          fontWeight: 400,
                                                          lineHeight: "15px",
                                                          marginBottom: 0,
                                                          color: _styles_colors__WEBPACK_IMPORTED_MODULE_6__
                                                              .Z.blackSecondary,
                                                      },
                                                      children: [
                                                          t(
                                                              "claim:cardHeader3"
                                                          ),
                                                          " ",
                                                          (0,
                                                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(
                                                              _LocalizedDate__WEBPACK_IMPORTED_MODULE_8__.Z,
                                                              {
                                                                  date:
                                                                      date ||
                                                                      new Date(),
                                                              }
                                                          ),
                                                      ],
                                                  }
                                              )
                                            : (0,
                                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(
                                                  Paragraph,
                                                  {
                                                      style: {
                                                          fontSize: 10,
                                                          fontWeight: 400,
                                                          lineHeight: "15px",
                                                          marginBottom: 0,
                                                          color: _styles_colors__WEBPACK_IMPORTED_MODULE_6__
                                                              .Z.blackSecondary,
                                                      },
                                                      children: [
                                                          t(
                                                              "claim:cardHeader1"
                                                          ),
                                                          " ",
                                                          (0,
                                                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(
                                                              _LocalizedDate__WEBPACK_IMPORTED_MODULE_8__.Z,
                                                              {
                                                                  date:
                                                                      date ||
                                                                      new Date(),
                                                              }
                                                          ),
                                                          " ",
                                                          t(
                                                              "claim:cardHeader2"
                                                          ),
                                                          " ",
                                                          (0,
                                                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(
                                                              "span",
                                                              {
                                                                  style: {
                                                                      fontWeight: 700,
                                                                  },
                                                                  children:
                                                                      speechTypeTranslation,
                                                              }
                                                          ),
                                                      ],
                                                  }
                                              ),
                                    }
                                ),
                            ],
                        }
                    );
                };
            (ClaimCardHeader.displayName = "ClaimCardHeader"),
                (__webpack_exports__.Z = ClaimCardHeader);
            try {
                (ClaimCardHeader.displayName = "ClaimCardHeader"),
                    (ClaimCardHeader.__docgenInfo = {
                        description: "",
                        displayName: "ClaimCardHeader",
                        props: {
                            personality: {
                                defaultValue: null,
                                description: "",
                                name: "personality",
                                required: !0,
                                type: { name: "any" },
                            },
                            date: {
                                defaultValue: null,
                                description: "",
                                name: "date",
                                required: !0,
                                type: { name: "any" },
                            },
                            claimType: {
                                defaultValue: {
                                    value: "ContentModelEnum.Speech",
                                },
                                description: "",
                                name: "claimType",
                                required: !1,
                                type: {
                                    name: "enum",
                                    value: [
                                        { value: '"Speech"' },
                                        { value: '"Image"' },
                                        { value: '"Debate"' },
                                    ],
                                },
                            },
                        },
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/Claim/ClaimCardHeader.tsx#ClaimCardHeader"
                        ] = {
                            docgenInfo: ClaimCardHeader.__docgenInfo,
                            name: "ClaimCardHeader",
                            path: "src/components/Claim/ClaimCardHeader.tsx#ClaimCardHeader",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
        },
        "./src/components/Claim/ClaimSentence.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, {
                Z: function () {
                    return Claim_ClaimSentence;
                },
            });
            __webpack_require__(
                "./node_modules/core-js/modules/es.object.assign.js"
            );
            var react = __webpack_require__("./node_modules/react/index.js"),
                colors = __webpack_require__("./src/styles/colors.ts"),
                constants_highlightColors = {
                    "not-fact": "#ADD8D8",
                    trustworthy: "#ACE0AC",
                    "trustworthy-but": "#D1DFB5",
                    arguable: "#E8D2C0",
                    misleading: "#F7BECC",
                    false: "#F5B3AF",
                    unsustainable: "#EDB5C8",
                    exaggerated: "#EEDCB0",
                    unverifiable: "#F4C8BA",
                    "in-progress": colors.Z.lightGraySecondary,
                },
                styled_components_browser_esm = __webpack_require__(
                    "./node_modules/styled-components/dist/styled-components.browser.esm.js"
                ),
                actions = __webpack_require__("./src/store/actions.ts"),
                es = __webpack_require__(
                    "./node_modules/react-redux/es/index.js"
                ),
                popover =
                    (__webpack_require__(
                        "./node_modules/antd/lib/popover/style/index.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/popover/index.js"
                    )),
                SecurityScanOutlined = __webpack_require__(
                    "./node_modules/@ant-design/icons/es/icons/SecurityScanOutlined.js"
                ),
                InfoCircleOutlined = __webpack_require__(
                    "./node_modules/@ant-design/icons/es/icons/InfoCircleOutlined.js"
                ),
                useTranslation = __webpack_require__(
                    "./node_modules/react-i18next/dist/es/useTranslation.js"
                ),
                jsx_runtime = __webpack_require__(
                    "./node_modules/react/jsx-runtime.js"
                ),
                SentencePopover =
                    (react.createElement,
                    function SentencePopover() {
                        var t = (0, useTranslation.$)().t,
                            content = (0, jsx_runtime.jsxs)("span", {
                                style: {
                                    color: colors.Z.bluePrimary,
                                    lineHeight: "20px",
                                    fontSize: 14,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                },
                                children: [
                                    (0, jsx_runtime.jsx)(
                                        SecurityScanOutlined.Z,
                                        { style: { fontSize: 20 } }
                                    ),
                                    t("claimReviewTask:sentenceInfo"),
                                ],
                            });
                        return (0, jsx_runtime.jsx)(popover.default, {
                            placement: "top",
                            content: content,
                            trigger: "hover",
                            children: (0, jsx_runtime.jsx)(
                                InfoCircleOutlined.Z,
                                { style: { color: colors.Z.graySecondary } }
                            ),
                        });
                    });
            SentencePopover.displayName = "SentencePopover";
            var Claim_SentencePopover = SentencePopover,
                Sentence =
                    (react.createElement,
                    styled_components_browser_esm.ZP.a.withConfig({
                        displayName: "ClaimSentence__Sentence",
                        componentId: "sc-ylhbsj-0",
                    })(
                        [
                            "color:",
                            ";font-size:18px;line-height:27px;:hover{color:",
                            ";text-decoration:underline;}",
                        ],
                        colors.Z.bluePrimary,
                        colors.Z.bluePrimary
                    )),
                ClaimSentence = function ClaimSentence(_ref) {
                    var showHighlights = _ref.showHighlights,
                        properties = _ref.properties,
                        data_hash = _ref.data_hash,
                        content = _ref.content,
                        handleSentenceClick = _ref.handleSentenceClick,
                        style = {};
                    properties.classification &&
                        showHighlights &&
                        (style = Object.assign({}, style, {
                            backgroundColor:
                                constants_highlightColors[
                                    properties.classification
                                ],
                        }));
                    var dispatch = (0, es.I0)();
                    return (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                        children: [
                            (0, jsx_runtime.jsxs)(Sentence, {
                                onClick: function handleClick() {
                                    handleSentenceClick(),
                                        dispatch(actions.Z.openReviewDrawer());
                                },
                                id: data_hash,
                                "data-hash": data_hash,
                                style: style,
                                className: "claim-sentence",
                                "data-cy": "frase" + properties.id,
                                children: [content, " "],
                            }),
                            "in-progress" === properties.classification &&
                                showHighlights &&
                                (0, jsx_runtime.jsx)("sup", {
                                    style: {
                                        color: constants_highlightColors[
                                            properties.classification
                                        ],
                                        fontWeight: 600,
                                        fontSize: "14px",
                                        lineHeight: "22px",
                                        padding: "0 4px 0 1px",
                                    },
                                    children: (0, jsx_runtime.jsx)(
                                        Claim_SentencePopover,
                                        {}
                                    ),
                                }),
                        ],
                    });
                },
                Claim_ClaimSentence = ClaimSentence;
            try {
                (ClaimSentence.displayName = "ClaimSentence"),
                    (ClaimSentence.__docgenInfo = {
                        description: "",
                        displayName: "ClaimSentence",
                        props: {
                            showHighlights: {
                                defaultValue: null,
                                description: "",
                                name: "showHighlights",
                                required: !0,
                                type: { name: "any" },
                            },
                            properties: {
                                defaultValue: null,
                                description: "",
                                name: "properties",
                                required: !0,
                                type: { name: "any" },
                            },
                            data_hash: {
                                defaultValue: null,
                                description: "",
                                name: "data_hash",
                                required: !0,
                                type: { name: "any" },
                            },
                            content: {
                                defaultValue: null,
                                description: "",
                                name: "content",
                                required: !0,
                                type: { name: "any" },
                            },
                            handleSentenceClick: {
                                defaultValue: null,
                                description: "",
                                name: "handleSentenceClick",
                                required: !0,
                                type: { name: "any" },
                            },
                        },
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/Claim/ClaimSentence.tsx#ClaimSentence"
                        ] = {
                            docgenInfo: ClaimSentence.__docgenInfo,
                            name: "ClaimSentence",
                            path: "src/components/Claim/ClaimSentence.tsx#ClaimSentence",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
        },
        "./src/components/ClassificationText.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__(
                "./node_modules/core-js/modules/es.object.assign.js"
            );
            var _constants_reviewColors__WEBPACK_IMPORTED_MODULE_2__ =
                    __webpack_require__("./src/constants/reviewColors.js"),
                react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    "./node_modules/react/index.js"
                ),
                next_i18next__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
                    "./node_modules/react-i18next/dist/es/useTranslation.js"
                ),
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ =
                    __webpack_require__("./node_modules/react/jsx-runtime.js"),
                ClassificationText =
                    (react__WEBPACK_IMPORTED_MODULE_0__.createElement,
                    function ClassificationText(props) {
                        var t = (0,
                        next_i18next__WEBPACK_IMPORTED_MODULE_4__.$)().t;
                        return (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(
                            "span",
                            {
                                style: Object.assign(
                                    {
                                        color:
                                            _constants_reviewColors__WEBPACK_IMPORTED_MODULE_2__
                                                .Z[props.classification] ||
                                            "#000",
                                        fontWeight: "bold",
                                        textTransform: "uppercase",
                                    },
                                    props.style
                                ),
                                "data-cy": props.classification,
                                children: [
                                    t(
                                        "claimReviewForm:" +
                                            props.classification
                                    ),
                                    " ",
                                ],
                            }
                        );
                    });
            (ClassificationText.displayName = "ClassificationText"),
                (__webpack_exports__.Z = ClassificationText);
            try {
                (ClassificationText.displayName = "ClassificationText"),
                    (ClassificationText.__docgenInfo = {
                        description: "",
                        displayName: "ClassificationText",
                        props: {
                            classification: {
                                defaultValue: null,
                                description: "",
                                name: "classification",
                                required: !0,
                                type: { name: "string" },
                            },
                            style: {
                                defaultValue: null,
                                description: "",
                                name: "style",
                                required: !1,
                                type: { name: "object" },
                            },
                        },
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/ClassificationText.tsx#ClassificationText"
                        ] = {
                            docgenInfo: ClassificationText.__docgenInfo,
                            name: "ClassificationText",
                            path: "src/components/ClassificationText.tsx#ClassificationText",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
        },
        "./src/components/Form/InputSearch.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__("./node_modules/antd/lib/input/style/index.js");
            var antd_lib_input__WEBPACK_IMPORTED_MODULE_5__ =
                    __webpack_require__(
                        "./node_modules/antd/lib/input/index.js"
                    ),
                react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                    "./node_modules/react/index.js"
                ),
                styled_components__WEBPACK_IMPORTED_MODULE_4__ =
                    __webpack_require__(
                        "./node_modules/styled-components/dist/styled-components.browser.esm.js"
                    ),
                _styles_colors__WEBPACK_IMPORTED_MODULE_2__ =
                    __webpack_require__("./src/styles/colors.ts"),
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ =
                    __webpack_require__("./node_modules/react/jsx-runtime.js"),
                InputSearchStyled =
                    (react__WEBPACK_IMPORTED_MODULE_1__.createElement,
                    (0, styled_components__WEBPACK_IMPORTED_MODULE_4__.ZP)(
                        antd_lib_input__WEBPACK_IMPORTED_MODULE_5__.Z.Search
                    ).withConfig({
                        displayName: "InputSearch__InputSearchStyled",
                        componentId: "sc-mmaiu4-0",
                    })(
                        [
                            "span.ant-input-group-addon{display:none;}span.ant-input-affix-wrapper{background:",
                            ";box-shadow:0px 2px 2px rgba(0,0,0,0.25);border-radius:4px;&:focus-within{border-color:#d9d9d9;}}input.ant-input{background:",
                            ";color:",
                            ";&::placeholder{color:",
                            ";}}",
                        ],
                        _styles_colors__WEBPACK_IMPORTED_MODULE_2__.Z.lightGray,
                        _styles_colors__WEBPACK_IMPORTED_MODULE_2__.Z.lightGray,
                        _styles_colors__WEBPACK_IMPORTED_MODULE_2__.Z
                            .blackSecondary,
                        _styles_colors__WEBPACK_IMPORTED_MODULE_2__.Z
                            .blackSecondary
                    )),
                InputSearch = function InputSearch(props) {
                    var timeout,
                        loading = !1;
                    return (0,
                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(
                        InputSearchStyled,
                        {
                            placeholder: props.placeholder || "",
                            size: "large",
                            loading: loading,
                            addonAfter: !1,
                            addonBefore: !1,
                            onChange: function onChange(e) {
                                return (function doSearch(e) {
                                    var searchText = e.target.value;
                                    timeout && clearTimeout(timeout),
                                        (timeout = setTimeout(function () {
                                            (loading = !0),
                                                props.callback(searchText),
                                                (loading = !1);
                                        }, 1e3));
                                })(e);
                            },
                            suffix:
                                props.suffix ||
                                (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment,
                                    {}
                                ),
                            "data-cy":
                                props["data-cy"] ||
                                "testInputSearchPersonality",
                        }
                    );
                };
            (InputSearch.displayName = "InputSearch"),
                (__webpack_exports__.Z = InputSearch);
            try {
                (InputSearch.displayName = "InputSearch"),
                    (InputSearch.__docgenInfo = {
                        description: "",
                        displayName: "InputSearch",
                        props: {},
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/Form/InputSearch.tsx#InputSearch"
                        ] = {
                            docgenInfo: InputSearch.__docgenInfo,
                            name: "InputSearch",
                            path: "src/components/Form/InputSearch.tsx#InputSearch",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
        },
        "./src/components/Header/Logo.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    "./node_modules/react/index.js"
                ),
                _styles_colors__WEBPACK_IMPORTED_MODULE_1__ =
                    __webpack_require__("./src/styles/colors.ts"),
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ =
                    __webpack_require__("./node_modules/react/jsx-runtime.js"),
                Logo =
                    (react__WEBPACK_IMPORTED_MODULE_0__.createElement,
                    function Logo(_ref) {
                        var _ref$color = _ref.color,
                            color =
                                void 0 === _ref$color
                                    ? _styles_colors__WEBPACK_IMPORTED_MODULE_1__
                                          .Z.logoWhite
                                    : _ref$color,
                            _ref$height = _ref.height,
                            height =
                                void 0 === _ref$height ? "42px" : _ref$height;
                        return (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(
                            "svg",
                            {
                                "data-cy": "logo",
                                height: height,
                                viewBox: "0 0 957 517",
                                fill: "none",
                                xmlns: "http://www.w3.org/2000/svg",
                                children: [
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(
                                        "path",
                                        {
                                            d: "M187.427 224.01h-33.963a.272.272 0 0 0-.168.052.212.212 0 0 0-.053.063.17.17 0 0 0-.021.075v7.339a.17.17 0 0 1-.038.109.228.228 0 0 1-.106.072.268.268 0 0 1-.135.007.234.234 0 0 1-.116-.059c-6.988-6.743-16.664-10.109-29.028-10.1-13.831 0-25.408 4.396-34.729 13.188-9.321 8.792-13.992 19.778-14.014 32.959 0 13.181 4.663 24.17 13.99 32.966s20.903 13.199 34.729 13.208c12.364 0 22.04-3.366 29.028-10.1a.234.234 0 0 1 .116-.059.268.268 0 0 1 .135.008c.043.014.08.039.105.071.026.032.04.071.039.11v7.338a.166.166 0 0 0 .021.075.198.198 0 0 0 .053.063.269.269 0 0 0 .168.053h33.962a.279.279 0 0 0 .168-.053.178.178 0 0 0 .074-.138v-87.071a.186.186 0 0 0-.07-.122.258.258 0 0 0-.147-.054Zm-40.212 57.559c-4 3.492-9.249 5.237-15.748 5.237-6.499 0-11.756-1.745-15.772-5.237-4.004-3.505-6.007-8.114-6.007-13.827 0-5.713 2.003-10.322 6.007-13.827 3.984-3.496 9.241-5.244 15.772-5.244 6.531 0 11.781 1.746 15.748 5.237 4.01 3.51 6.012 8.119 6.007 13.827-.005 5.709-2.008 10.32-6.007 13.834ZM351.54 234.677c-9.577-8.744-21.725-13.114-36.444-13.109-15.234 0-27.775 4.426-37.623 13.279-9.848 8.853-14.769 19.872-14.764 33.058 0 13.282 5.024 24.272 15.071 32.97 10.047 8.699 23.41 13.037 40.089 13.014 18.378 0 32.438-5.362 42.179-16.087a.17.17 0 0 0 .054-.151.177.177 0 0 0-.029-.076.223.223 0 0 0-.063-.059l-23.288-14.482a.267.267 0 0 0-.283 0c-4.835 4.011-10.762 6.015-17.782 6.01-11.272 0-18.583-3.46-21.932-10.382-.014-.031-.019-.065-.014-.098a.19.19 0 0 1 .038-.092.247.247 0 0 1 .191-.089h67.427a.243.243 0 0 0 .14-.047.19.19 0 0 0 .074-.116 41.26 41.26 0 0 0 1.333-10.682c0-13.163-4.791-24.117-14.374-32.861Zm-17.827 23.6h-37.21a.241.241 0 0 1-.185-.075.188.188 0 0 1-.045-.176c2.813-7.982 9.223-11.978 19.229-11.987 9.613 0 15.755 3.995 18.425 11.987.01.029.011.06.005.09a.185.185 0 0 1-.041.083.225.225 0 0 1-.178.078ZM421.387 249.471h19.369a.213.213 0 0 0 .151-.062.203.203 0 0 0 .063-.148v-29.202a.203.203 0 0 0-.063-.148.213.213 0 0 0-.151-.062h-19.369a.21.21 0 0 1-.214-.21v-25.553a.204.204 0 0 0-.023-.094.195.195 0 0 0-.063-.074.217.217 0 0 0-.188-.035l-31.151 9.186a.219.219 0 0 0-.11.073.204.204 0 0 0-.045.123v16.396a.202.202 0 0 1-.127.194.22.22 0 0 1-.081.016h-13.876a.215.215 0 0 0-.199.129.225.225 0 0 0-.016.081v29.18a.215.215 0 0 0 .215.21h13.854a.202.202 0 0 1 .149.062.195.195 0 0 1 .058.148v27.508c0 14.777 3.842 24.986 11.524 30.627 7.682 5.642 20.91 7.355 39.684 5.14a.21.21 0 0 0 .139-.067.199.199 0 0 0 .053-.143v-27.508a.21.21 0 0 0-.07-.149.218.218 0 0 0-.159-.053c-6.987.347-11.987.033-15.002-.941-3.015-.975-4.537-3.521-4.566-7.638v-26.784a.205.205 0 0 1 .065-.143.217.217 0 0 1 .149-.059ZM562.939 258.119v55.574a.199.199 0 0 1-.07.142.246.246 0 0 1-.16.061h-34.58a.248.248 0 0 1-.16-.061.198.198 0 0 1-.069-.142v-51.65c0-4.867-1.445-8.516-4.325-11.011-2.88-2.495-6.721-3.735-11.488-3.735-5.506 0-9.749 1.45-12.777 4.352-3.028 2.901-4.53 7.137-4.53 12.606v49.417a.201.201 0 0 1-.069.141.255.255 0 0 1-.16.062h-34.588a.255.255 0 0 1-.161-.062.201.201 0 0 1-.069-.141V175.946a.31.31 0 0 1 .075-.199.38.38 0 0 1 .196-.12l34.268-9.429a.418.418 0 0 1 .34.049.344.344 0 0 1 .116.118.308.308 0 0 1 .044.152v62.813c0 .044.016.086.045.121.029.035.069.06.116.073a.257.257 0 0 0 .143-.001.227.227 0 0 0 .115-.077c6.335-7.611 15.968-11.414 28.901-11.409 11.406 0 20.731 3.45 27.974 10.35 7.243 6.901 10.867 16.811 10.873 29.732ZM670.558 234.677c-9.6-8.744-21.751-13.114-36.452-13.109-15.232 0-27.773 4.426-37.624 13.279-9.85 8.853-14.775 19.872-14.775 33.058 0 13.282 5.025 24.272 15.074 32.97 10.049 8.699 23.408 13.037 40.075 13.014 18.439 0 32.51-5.362 42.212-16.087a.192.192 0 0 0 .065-.143.195.195 0 0 0-.065-.143l-23.354-14.482a.26.26 0 0 0-.284 0c-4.841 4.011-10.772 6.015-17.793 6.01-11.29 0-18.6-3.46-21.929-10.382a.178.178 0 0 1-.025-.095.176.176 0 0 1 .032-.093.204.204 0 0 1 .078-.067.242.242 0 0 1 .106-.024h67.45a.263.263 0 0 0 .145-.049.222.222 0 0 0 .085-.114 41.26 41.26 0 0 0 1.333-10.682c.015-13.163-4.769-24.117-14.354-32.861Zm-17.847 23.6h-37.218a.234.234 0 0 1-.174-.08.2.2 0 0 1-.042-.082.179.179 0 0 1 .002-.089c2.813-7.982 9.219-11.978 19.218-11.987 9.615 0 15.758 3.995 18.429 11.987a.177.177 0 0 1-.032.176.215.215 0 0 1-.081.058.236.236 0 0 1-.102.017ZM713.056 212.35a19.104 19.104 0 0 0 13.2-5.502 18.69 18.69 0 0 0 5.563-13.056 17.353 17.353 0 0 0-1.412-7.057 17.511 17.511 0 0 0-4.158-5.902 18.676 18.676 0 0 0-6.052-4.005 18.833 18.833 0 0 0-14.283 0 18.671 18.671 0 0 0-6.051 4.005 17.528 17.528 0 0 0-4.159 5.902 17.353 17.353 0 0 0-1.412 7.057 18.694 18.694 0 0 0 5.563 13.056 19.104 19.104 0 0 0 13.201 5.502ZM731.631 221.568h-27.765c-.106 0-.191.093-.191.208v91.905c0 .115.085.208.191.208h27.765c.105 0 .191-.093.191-.208v-91.905c0-.115-.086-.208-.191-.208ZM862.973 224.01h-33.96a.268.268 0 0 0-.168.052.198.198 0 0 0-.053.063.17.17 0 0 0-.021.075v7.339a.17.17 0 0 1-.038.109.228.228 0 0 1-.106.072.268.268 0 0 1-.135.007.234.234 0 0 1-.116-.059c-6.988-6.743-16.663-10.109-29.026-10.1-13.83 0-25.406 4.396-34.726 13.188-9.321 8.792-14 19.778-14.038 32.959 0 13.181 4.671 24.17 14.013 32.966 9.343 8.796 20.918 13.199 34.727 13.208 12.363 0 22.038-3.366 29.026-10.1a.235.235 0 0 1 .115-.059.272.272 0 0 1 .136.008c.043.014.08.039.105.071a.174.174 0 0 1 .039.11v7.338a.186.186 0 0 0 .074.138.256.256 0 0 0 .168.053h33.96a.26.26 0 0 0 .088-.013.223.223 0 0 0 .074-.041.186.186 0 0 0 .049-.063.159.159 0 0 0 .015-.074v-87.071a.174.174 0 0 0-.061-.121.236.236 0 0 0-.141-.055Zm-40.209 57.559c-4.031 3.489-9.256 5.237-15.771 5.237-6.514 0-11.747-1.748-15.746-5.237-3.999-3.489-6.007-8.114-6.007-13.827 0-5.713 2-10.317 6.007-13.827 4.007-3.509 9.256-5.237 15.746-5.237 6.491 0 11.748 1.755 15.771 5.237 4.023 3.482 6.007 8.114 6.007 13.827 0 5.713-2 10.325-6.007 13.827ZM253.325 320.339c-3.546 1.59-9.06 2.79-16.548 2.79-22.875 0-30.363-15.09-30.363-37.311V176.953a.35.35 0 0 1 .245-.338l33.21-10.417a.355.355 0 0 1 .312.053.354.354 0 0 1 .142.285v120.482c0 6.749 3.145 8.714 5.514 8.714a12.512 12.512 0 0 0 3.547-.382l3.941 24.989Z",
                                            fill: color,
                                        }
                                    ),
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(
                                        "path",
                                        {
                                            d: "M957 76.024v337.27a2.096 2.096 0 0 1-.632 1.515c-.41.405-.971.637-1.558.645h-62.461c-.477 0-.933-.183-1.27-.507a1.693 1.693 0 0 1-.526-1.221v-20.944c0-.458.189-.898.526-1.222a1.832 1.832 0 0 1 1.27-.506h38.601V98.264H26.057v292.79h424.151a2.26 2.26 0 0 1 1.562.625c.205.198.367.432.478.691.11.258.166.535.165.814v20.11c.003.281-.051.56-.161.821a2.118 2.118 0 0 1-.476.699 2.212 2.212 0 0 1-.718.47 2.29 2.29 0 0 1-.85.17H2.19a2.28 2.28 0 0 1-.848-.17 2.211 2.211 0 0 1-.715-.471 2.104 2.104 0 0 1-.471-.699 2.053 2.053 0 0 1-.156-.82V76.024c0-.573.237-1.122.658-1.527a2.29 2.29 0 0 1 1.587-.633H954.81a2.27 2.27 0 0 1 1.556.647c.41.404.638.948.634 1.513Z",
                                            fill: color,
                                        }
                                    ),
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(
                                        "path",
                                        {
                                            d: "M515.077 350.905c-6.226-.489-11.142 1.082-14.519 4.675-3.378 3.593-5.153 8.884-5.153 15.746v.868h-6.518a.892.892 0 0 0-.385.085c-.122.057-.233.14-.327.246a1.16 1.16 0 0 0-.217.37 1.26 1.26 0 0 0-.074.436v6.428c-.001.15.024.298.074.437.05.138.124.264.217.37.094.105.205.189.327.246a.891.891 0 0 0 .385.084h6.531v42.642c0 .15.027.298.077.437.051.138.126.264.22.37.094.105.205.189.327.246a.914.914 0 0 0 .386.084h5.843a.914.914 0 0 0 .386-.084c.122-.057.233-.141.327-.246.094-.106.169-.232.219-.37.051-.139.077-.287.077-.437v-42.642h11.741a.896.896 0 0 0 .386-.084 1 1 0 0 0 .328-.246c.094-.106.168-.231.219-.37.051-.138.077-.287.077-.437v-6.443c0-.15-.026-.299-.077-.437a1.144 1.144 0 0 0-.219-.37 1 1 0 0 0-.328-.246.896.896 0 0 0-.386-.084h-11.754v-.869c0-4.454.94-7.644 2.785-9.476 1.845-1.832 4.875-2.606 8.858-2.235a.867.867 0 0 0 .412-.054.96.96 0 0 0 .354-.246c.103-.105.186-.234.242-.379.057-.144.086-.3.085-.458v-6.428a1.237 1.237 0 0 0-.27-.768.975.975 0 0 0-.656-.361ZM571.16 370.486h-6.778a1.178 1.178 0 0 0-.819.339c-.217.214-.34.505-.343.809v6.373c-4.841-5.784-11.36-8.708-19.566-8.708a26.946 26.946 0 0 0-10.615 2.019 26.646 26.646 0 0 0-8.927 6.02c-5.184 5.261-8.084 12.311-8.084 19.651s2.9 14.39 8.084 19.651a26.638 26.638 0 0 0 8.926 6.024 26.916 26.916 0 0 0 10.616 2.023c8.206 0 14.758-2.924 19.566-8.708v6.374c.003.303.126.594.343.809.218.214.512.336.819.338h6.778a1.18 1.18 0 0 0 .819-.338c.218-.215.341-.506.343-.809v-50.735a1.147 1.147 0 0 0-.348-.799 1.18 1.18 0 0 0-.814-.333Zm-13.442 39.9a19.388 19.388 0 0 1-13.535 5.488 19.388 19.388 0 0 1-13.536-5.488 18.427 18.427 0 0 1-4.139-6.103 18.94 18.94 0 0 1-1.363-7.322 17.96 17.96 0 0 1 1.337-7.277 18.164 18.164 0 0 1 4.165-6.147 19.385 19.385 0 0 1 13.536-5.489c5.067 0 9.93 1.972 13.535 5.489a19.178 19.178 0 0 1 5.501 13.424 19.18 19.18 0 0 1-5.501 13.425ZM628.113 409.401l-5.069-3.237a.978.978 0 0 0-.392-.152.94.94 0 0 0-.415.029c-.135.04-.261.11-.372.205-.11.095-.201.213-.269.348-1.533 2.84-3.717 5.185-6.332 6.803-2.616 1.617-5.571 2.45-8.57 2.414-2.999-.035-5.938-.938-8.521-2.617-2.583-1.679-4.72-4.076-6.198-6.951-1.477-2.874-2.243-6.126-2.221-9.429.022-3.304.832-6.542 2.348-9.393 1.516-2.85 3.685-5.212 6.291-6.849 2.605-1.636 5.555-2.491 8.555-2.478 3.051-.045 6.056.829 8.689 2.528 2.438 1.542 4.37 3.895 5.517 6.723.06.147.147.279.256.387a.969.969 0 0 0 1.221.147l4.975-3.19c.225-.141.394-.37.474-.641a1.252 1.252 0 0 0-.04-.826c-1.742-4.25-4.639-7.799-8.29-10.159-3.868-2.526-8.292-3.828-12.788-3.764-7.19 0-13.265 2.687-18.051 7.974-4.623 5.303-7.204 12.369-7.204 19.72 0 7.352 2.581 14.418 7.204 19.721 4.786 5.311 10.861 7.974 18.051 7.974 4.483.051 8.895-1.23 12.773-3.708 3.753-2.359 6.804-5.866 8.783-10.095.111-.259.131-.554.056-.828a1.151 1.151 0 0 0-.461-.656ZM665.186 373.6h-11.049v-12.446a1.257 1.257 0 0 0-.104-.494 1.074 1.074 0 0 0-.282-.387.886.886 0 0 0-.403-.2.834.834 0 0 0-.437.031l-5.498 1.933a.96.96 0 0 0-.476.4 1.22 1.22 0 0 0-.18.649V373.6h-7.805a.825.825 0 0 0-.363.081.934.934 0 0 0-.308.237 1.117 1.117 0 0 0-.207.356 1.275 1.275 0 0 0-.072.421v6.192c0 .145.025.288.072.421.048.134.118.255.207.357a.961.961 0 0 0 .308.237.84.84 0 0 0 .363.081h7.805v28.215c0 6.002 1.626 10.156 4.837 12.362 2.064 1.407 4.81 2.122 8.198 2.122a32.58 32.58 0 0 0 5.551-.532.927.927 0 0 0 .576-.371c.148-.2.229-.454.23-.717v-5.614a1.212 1.212 0 0 0-.082-.415 1.08 1.08 0 0 0-.213-.346.902.902 0 0 0-.319-.238.79.79 0 0 0-.376-.066c-2.621.129-4.856.175-6.612.144-1.52 0-2.621-.479-3.316-1.384-.695-.906-1.081-2.572-1.081-4.915v-28.245h11.049a.84.84 0 0 0 .363-.081.961.961 0 0 0 .308-.237 1.09 1.09 0 0 0 .206-.357c.048-.133.073-.276.073-.421v-6.207a1.265 1.265 0 0 0-.077-.42 1.11 1.11 0 0 0-.211-.353.953.953 0 0 0-.311-.232.826.826 0 0 0-.364-.075ZM694.247 415.443c-1.54.004-3.055.194-4.41.554-1.355.36-2.509.879-3.36 1.511-.851.631-1.373 1.356-1.521 2.11-.147.754.086 1.515.677 2.214.592.7 1.525 1.317 2.716 1.797 1.191.481 2.604.809 4.115.957 1.51.148 3.071.111 4.545-.108 1.475-.219 2.816-.614 3.908-1.148 1.319-.647 2.217-1.471 2.581-2.37.363-.898.175-1.829-.54-2.674-.715-.846-1.925-1.568-3.476-2.074-1.551-.506-3.374-.774-5.235-.769ZM751.772 377.279c-5.348-5.119-12.503-7.982-19.95-7.982-7.448 0-14.603 2.863-19.95 7.982-5.252 5.249-8.197 12.33-8.197 19.709s2.945 14.461 8.197 19.709c5.344 5.126 12.5 7.992 19.95 7.992 7.449 0 14.605-2.866 19.95-7.992 5.252-5.248 8.197-12.33 8.197-19.709s-2.945-14.46-8.197-19.709Zm-6.455 33.14a19.388 19.388 0 0 1-13.536 5.488c-5.067 0-9.93-1.972-13.535-5.488a18.432 18.432 0 0 1-4.139-6.104 18.942 18.942 0 0 1-1.363-7.323 17.948 17.948 0 0 1 1.338-7.278 18.151 18.151 0 0 1 4.164-6.148 19.384 19.384 0 0 1 13.535-5.489c5.068 0 9.931 1.972 13.536 5.489a19.121 19.121 0 0 1 5.526 13.426c0 5.016-1.983 9.834-5.526 13.427ZM796.208 369.297c-7.276 0-12.884 2.224-16.733 6.624V371.3a1.099 1.099 0 0 0-.096-.454 1.184 1.184 0 0 0-.28-.385 1.363 1.363 0 0 0-.916-.343h-7.537c-.17 0-.338.03-.495.089-.157.06-.299.147-.419.257-.12.109-.215.24-.28.383a1.096 1.096 0 0 0-.098.453v52.207c0 .314.136.615.378.836.242.222.571.346.914.346h7.537a1.363 1.363 0 0 0 .916-.343c.12-.11.215-.241.28-.385.064-.144.097-.298.096-.454v-29.018c0-5.606 1.579-9.727 4.701-12.264 3.336-2.629 7.632-4.012 12.032-3.874.344-.002.673-.129.915-.352a1.14 1.14 0 0 0 .378-.838v-6.682c0-.156-.034-.309-.099-.453a1.186 1.186 0 0 0-.28-.383 1.291 1.291 0 0 0-.419-.256 1.387 1.387 0 0 0-.495-.09ZM852.646 370.46h-6.737a1.203 1.203 0 0 0-.829.325 1.12 1.12 0 0 0-.349.796v6.224c-4.841-5.649-11.361-8.504-19.542-8.504a27.504 27.504 0 0 0-10.655 1.942 26.684 26.684 0 0 0-8.968 5.878c-5.174 5.142-8.068 12.026-8.068 19.191 0 7.165 2.894 14.049 8.068 19.191a26.697 26.697 0 0 0 8.937 5.888 27.502 27.502 0 0 0 10.629 1.971c8.182 0 14.734-2.856 19.543-8.505v4.21c0 4.8-1.533 8.481-4.696 11.297-3.163 2.817-7.569 4.21-13.104 4.21-8.762 0-14.435-2.747-17.323-8.38a1.105 1.105 0 0 0-.291-.361 1.168 1.168 0 0 0-.419-.215 1.223 1.223 0 0 0-.92.094l-5.955 3.26a1.17 1.17 0 0 0-.53.656c-.086.274-.064.57.062.83 4.382 8.426 12.91 12.69 25.376 12.69 6.894.133 13.605-2.135 18.905-6.388 5.317-4.303 8.012-10.255 8.012-17.693v-47.502a1.111 1.111 0 0 0-.342-.775 1.198 1.198 0 0 0-.804-.33Zm-13.442 38.966c-3.605 3.434-8.468 5.36-13.535 5.36s-9.93-1.926-13.535-5.36c-3.529-3.516-5.501-8.217-5.501-13.11 0-4.893 1.972-9.595 5.501-13.111 3.605-3.434 8.468-5.36 13.535-5.36s9.93 1.926 13.535 5.36c3.529 3.516 5.501 8.218 5.501 13.111 0 4.893-1.972 9.594-5.501 13.11Z",
                                            fill: color,
                                        }
                                    ),
                                ],
                            }
                        );
                    });
            (Logo.displayName = "Logo"), (__webpack_exports__.Z = Logo);
            try {
                (Logo.displayName = "Logo"),
                    (Logo.__docgenInfo = {
                        description: "",
                        displayName: "Logo",
                        props: {
                            color: {
                                defaultValue: { value: "#E8E8E8" },
                                description: "",
                                name: "color",
                                required: !1,
                                type: { name: "string" },
                            },
                            height: {
                                defaultValue: { value: "42px" },
                                description: "",
                                name: "height",
                                required: !1,
                                type: { name: "string" },
                            },
                        },
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/Header/Logo.tsx#Logo"
                        ] = {
                            docgenInfo: Logo.__docgenInfo,
                            name: "Logo",
                            path: "src/components/Header/Logo.tsx#Logo",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
        },
        "./src/components/LocalizedDate.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    "./node_modules/react/index.js"
                ),
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ =
                    __webpack_require__("./node_modules/react/jsx-runtime.js"),
                LocalizedDate =
                    (react__WEBPACK_IMPORTED_MODULE_0__.createElement,
                    function LocalizedDate(_ref) {
                        var date = _ref.date,
                            _ref$showTime = _ref.showTime,
                            showTime =
                                void 0 !== _ref$showTime && _ref$showTime,
                            localizedDate = (date = new Date(
                                date
                            )).toLocaleDateString(),
                            localizedTime = date.toLocaleTimeString();
                        return (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(
                            "span",
                            {
                                style: { fontWeight: 700 },
                                children: [
                                    localizedDate,
                                    showTime && " - " + localizedTime,
                                ],
                            }
                        );
                    });
            (LocalizedDate.displayName = "LocalizedDate"),
                (__webpack_exports__.Z = LocalizedDate);
            try {
                (LocalizedDate.displayName = "LocalizedDate"),
                    (LocalizedDate.__docgenInfo = {
                        description: "",
                        displayName: "LocalizedDate",
                        props: {
                            date: {
                                defaultValue: null,
                                description: "",
                                name: "date",
                                required: !0,
                                type: { name: "Date" },
                            },
                            showTime: {
                                defaultValue: { value: "false" },
                                description: "",
                                name: "showTime",
                                required: !1,
                                type: { name: "boolean" },
                            },
                        },
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/LocalizedDate.tsx#LocalizedDate"
                        ] = {
                            docgenInfo: LocalizedDate.__docgenInfo,
                            name: "LocalizedDate",
                            path: "src/components/LocalizedDate.tsx#LocalizedDate",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
        },
        "./src/components/Metrics/ReviewStats.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, {
                Z: function () {
                    return Metrics_ReviewStats;
                },
            });
            __webpack_require__(
                "./node_modules/core-js/modules/es.array.slice.js"
            );
            var react = __webpack_require__("./node_modules/react/index.js"),
                ArrowDownOutlined = __webpack_require__(
                    "./node_modules/@ant-design/icons/es/icons/ArrowDownOutlined.js"
                ),
                ArrowUpOutlined = __webpack_require__(
                    "./node_modules/@ant-design/icons/es/icons/ArrowUpOutlined.js"
                ),
                useTranslation = __webpack_require__(
                    "./node_modules/react-i18next/dist/es/useTranslation.js"
                ),
                Button = __webpack_require__("./src/components/Button.tsx"),
                progress =
                    (__webpack_require__(
                        "./node_modules/antd/lib/progress/style/index.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/progress/index.js"
                    )),
                reviewColors =
                    (__webpack_require__(
                        "./node_modules/core-js/modules/es.object.assign.js"
                    ),
                    __webpack_require__(
                        "./node_modules/core-js/modules/es.array.map.js"
                    ),
                    __webpack_require__("./src/constants/reviewColors.js")),
                colors = __webpack_require__("./src/styles/colors.ts"),
                constants_statsReviewColors = {
                    "not-fact": "#029393",
                    trustworthy: "#00AE00",
                    "trustworthy-but": "#7BA91E",
                    arguable: "#C98043",
                    misleading: "#FA3C6A",
                    false: "#F21709",
                    unsustainable: "#D81D5F",
                    exaggerated: "#DB9F0D",
                    unverifiable: "#EF5C2E",
                },
                jsx_runtime = __webpack_require__(
                    "./node_modules/react/jsx-runtime.js"
                ),
                ReviewProgress =
                    (react.createElement,
                    function ReviewProgress(_ref) {
                        var reviews = _ref.reviews,
                            statsProps = _ref.statsProps,
                            t = (0, useTranslation.$)().t,
                            getStyle = function getStyle(reviewId) {
                                var defaultStyle = {
                                    strokeWidth: statsProps.strokeWidth || 18,
                                    width: statsProps.width || 80,
                                    strokeLinecap:
                                        "circle" === statsProps.type
                                            ? "square"
                                            : "round",
                                    trailColor: colors.Z.grayTertiary,
                                };
                                return Object.assign({}, defaultStyle, {
                                    strokeColor:
                                        constants_statsReviewColors[reviewId] ||
                                        "#000",
                                });
                            };
                        return reviews.map(function (review) {
                            var format =
                                "count" === statsProps.format
                                    ? function () {
                                          return review.count;
                                      }
                                    : null;
                            return (0,
                            jsx_runtime.jsxs)("div", { style: "circle" === statsProps.type ? { display: "flex", flexDirection: "column-reverse", alignItems: "center", paddingRight: "10px" } : {}, children: [(0, jsx_runtime.jsxs)("span", { style: { color: reviewColors.Z[review._id] || "#000", fontWeight: "700", textTransform: "uppercase", textAlign: "center", fontSize: "10px", marginTop: "5px" }, children: [statsProps.countInTitle && review.count + " ", t("claimReviewForm:" + review._id)] }), (0, jsx_runtime.jsx)(progress.Z, Object.assign({ percent: review.percentage, type: statsProps.type, format: format }, getStyle(review._id)))] }, review._id);
                        });
                    }),
                Metrics_ReviewProgress = ReviewProgress;
            try {
                (ReviewProgress.displayName = "ReviewProgress"),
                    (ReviewProgress.__docgenInfo = {
                        description: "",
                        displayName: "ReviewProgress",
                        props: {
                            reviews: {
                                defaultValue: null,
                                description: "",
                                name: "reviews",
                                required: !0,
                                type: { name: "any" },
                            },
                            statsProps: {
                                defaultValue: null,
                                description: "",
                                name: "statsProps",
                                required: !0,
                                type: { name: "any" },
                            },
                        },
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/Metrics/ReviewProgress.tsx#ReviewProgress"
                        ] = {
                            docgenInfo: ReviewProgress.__docgenInfo,
                            name: "ReviewProgress",
                            path: "src/components/Metrics/ReviewProgress.tsx#ReviewProgress",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
            __webpack_require__(
                "./node_modules/antd/lib/typography/style/index.js"
            );
            var typography = __webpack_require__(
                    "./node_modules/antd/lib/typography/index.js"
                ),
                Title = (react.createElement, typography.Z.Title),
                AletheiaTitle = function AletheiaTitle(props) {
                    return (0, jsx_runtime.jsx)(Title, {
                        level: props.level,
                        style: Object.assign(
                            {
                                fontSize: 14,
                                color: colors.Z.white,
                                fontWeight: 400,
                                margin: 0,
                            },
                            props.style
                        ),
                        children: props.children,
                    });
                };
            AletheiaTitle.displayName = "AletheiaTitle";
            var components_AletheiaTitle = AletheiaTitle;
            try {
                (AletheiaTitle.displayName = "AletheiaTitle"),
                    (AletheiaTitle.__docgenInfo = {
                        description: "",
                        displayName: "AletheiaTitle",
                        props: {},
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/AletheiaTitle.tsx#AletheiaTitle"
                        ] = {
                            docgenInfo: AletheiaTitle.__docgenInfo,
                            name: "AletheiaTitle",
                            path: "src/components/AletheiaTitle.tsx#AletheiaTitle",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
            react.createElement;
            var ReviewStats = function ReviewStats(props) {
                    var t = (0, useTranslation.$)().t,
                        _useState = (0, react.useState)(!1),
                        showAllReviews = _useState[0],
                        setShowAllReviews = _useState[1],
                        reviews = ((null == props ? void 0 : props.stats) || {})
                            .reviews,
                        firstThreeReviews =
                            null == reviews ? void 0 : reviews.slice(0, 3),
                        remainingReviews =
                            null == reviews ? void 0 : reviews.slice(3),
                        reviewStats =
                            "line" === props.type ? firstThreeReviews : reviews;
                    return (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                        children: [
                            reviews &&
                                (0, jsx_runtime.jsx)(Metrics_ReviewProgress, {
                                    reviews: reviewStats,
                                    statsProps: props,
                                }),
                            reviews &&
                                showAllReviews &&
                                (0, jsx_runtime.jsx)(Metrics_ReviewProgress, {
                                    reviews: remainingReviews,
                                    statsProps: props,
                                }),
                            reviews &&
                                (null == reviews ? void 0 : reviews.length) >
                                    3 &&
                                "line" === props.type &&
                                (0, jsx_runtime.jsxs)("div", {
                                    style: {
                                        display: "flex",
                                        justifyContent: "center",
                                    },
                                    children: [
                                        !showAllReviews &&
                                            (0, jsx_runtime.jsxs)(Button.Z, {
                                                style: {
                                                    marginTop: "24px",
                                                    paddingBottom: 0,
                                                },
                                                type: Button.L.blue,
                                                onClick: function onClick() {
                                                    return setShowAllReviews(
                                                        !0
                                                    );
                                                },
                                                children: [
                                                    (0, jsx_runtime.jsx)(
                                                        components_AletheiaTitle,
                                                        {
                                                            level: 4,
                                                            children: t(
                                                                "personality:seeAllMetricsOverviews"
                                                            ),
                                                        }
                                                    ),
                                                    (0, jsx_runtime.jsx)(
                                                        ArrowDownOutlined.Z,
                                                        {
                                                            style: {
                                                                marginLeft: 5,
                                                                fontSize: 14,
                                                            },
                                                        }
                                                    ),
                                                ],
                                            }),
                                        showAllReviews &&
                                            (0, jsx_runtime.jsxs)(Button.Z, {
                                                style: {
                                                    marginTop: "24px",
                                                    paddingBottom: 0,
                                                },
                                                type: Button.L.blue,
                                                onClick: function onClick() {
                                                    return setShowAllReviews(
                                                        !1
                                                    );
                                                },
                                                children: [
                                                    (0, jsx_runtime.jsx)(
                                                        components_AletheiaTitle,
                                                        {
                                                            level: 4,
                                                            children: t(
                                                                "personality:seeLessMetricsOverviews"
                                                            ),
                                                        }
                                                    ),
                                                    (0, jsx_runtime.jsx)(
                                                        ArrowUpOutlined.Z,
                                                        {
                                                            style: {
                                                                marginLeft: 5,
                                                                fontSize: 14,
                                                            },
                                                        }
                                                    ),
                                                ],
                                            }),
                                    ],
                                }),
                        ],
                    });
                },
                Metrics_ReviewStats = ReviewStats;
            try {
                (ReviewStats.displayName = "ReviewStats"),
                    (ReviewStats.__docgenInfo = {
                        description: "",
                        displayName: "ReviewStats",
                        props: {},
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/Metrics/ReviewStats.tsx#ReviewStats"
                        ] = {
                            docgenInfo: ReviewStats.__docgenInfo,
                            name: "ReviewStats",
                            path: "src/components/Metrics/ReviewStats.tsx#ReviewStats",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
        },
        "./src/components/Modal/AletheiaModal.style.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, {
                IB: function () {
                    return ModalCancelButton;
                },
                Rt: function () {
                    return AletheiaModal;
                },
            });
            __webpack_require__(
                "./node_modules/antd/lib/button/style/index.js"
            );
            var antd_lib_button__WEBPACK_IMPORTED_MODULE_5__ =
                    __webpack_require__(
                        "./node_modules/antd/lib/button/index.js"
                    ),
                antd_lib_modal__WEBPACK_IMPORTED_MODULE_4__ =
                    (__webpack_require__(
                        "./node_modules/antd/lib/modal/style/index.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/modal/index.js"
                    )),
                styled_components__WEBPACK_IMPORTED_MODULE_3__ =
                    __webpack_require__(
                        "./node_modules/styled-components/dist/styled-components.browser.esm.js"
                    ),
                _styles_colors__WEBPACK_IMPORTED_MODULE_2__ =
                    __webpack_require__("./src/styles/colors.ts"),
                AletheiaModal = (0,
                styled_components__WEBPACK_IMPORTED_MODULE_3__.ZP)(
                    antd_lib_modal__WEBPACK_IMPORTED_MODULE_4__.Z
                ).withConfig({
                    displayName: "AletheiaModalstyle__AletheiaModal",
                    componentId: "sc-1ix1316-0",
                })(
                    [
                        "background:none;box-shadow:none;padding:0;.ant-modal-content{width:",
                        ";margin:0 auto;border-radius:8px;background-color:",
                        ";box-shadow:0px 0px 15px rgba(0,0,0,0.25);padding:26px 26px;max-width:90vw;}.ant-modal-body{padding:0;}.ant-modal-header{background:none;border-bottom:0px;padding:0 0 10px 0;}.ant-modal-title{color:",
                        ';font-weight:700;font-size:14px;text-align:center;text-transform:uppercase;}svg[data-icon="close"]{margin-top:26px;width:14px;height:14px;color:',
                        ";margin-right:20px;}",
                    ],
                    function (props) {
                        return props.width ? props.width : "300px";
                    },
                    _styles_colors__WEBPACK_IMPORTED_MODULE_2__.Z.lightGray,
                    _styles_colors__WEBPACK_IMPORTED_MODULE_2__.Z.blackPrimary,
                    _styles_colors__WEBPACK_IMPORTED_MODULE_2__.Z.blackPrimary
                ),
                ModalCancelButton = (0,
                styled_components__WEBPACK_IMPORTED_MODULE_3__.ZP)(
                    antd_lib_button__WEBPACK_IMPORTED_MODULE_5__.default
                ).withConfig({
                    displayName: "AletheiaModalstyle__ModalCancelButton",
                    componentId: "sc-1ix1316-1",
                })(
                    [
                        "height:40px;width:120px;color:",
                        ';text-align:"center";font-weight:700;font-size:14;',
                    ],
                    _styles_colors__WEBPACK_IMPORTED_MODULE_2__.Z.bluePrimary
                );
        },
        "./src/components/Modal/OrderModal.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            var next_i18next__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
                    "./node_modules/react-i18next/dist/es/useTranslation.js"
                ),
                react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    "./node_modules/react/index.js"
                ),
                _Button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                    "./src/components/Button.tsx"
                ),
                _Radio_OrderRadio__WEBPACK_IMPORTED_MODULE_2__ =
                    __webpack_require__(
                        "./src/components/Radio/OrderRadio.tsx"
                    ),
                _AletheiaModal_style__WEBPACK_IMPORTED_MODULE_3__ =
                    __webpack_require__(
                        "./src/components/Modal/AletheiaModal.style.tsx"
                    ),
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ =
                    __webpack_require__("./node_modules/react/jsx-runtime.js"),
                OrderModal =
                    (react__WEBPACK_IMPORTED_MODULE_0__.createElement,
                    function OrderModal(_ref) {
                        var visible = _ref.visible,
                            value = _ref.value,
                            setValue = _ref.setValue,
                            handleOk = _ref.handleOk,
                            handleCancel = _ref.handleCancel,
                            t = (0,
                            next_i18next__WEBPACK_IMPORTED_MODULE_5__.$)().t;
                        return (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(
                            _AletheiaModal_style__WEBPACK_IMPORTED_MODULE_3__.Rt,
                            {
                                className: "ant-modal-content",
                                visible: visible,
                                footer: !1,
                                onCancel: handleCancel,
                                title: t("orderModal:title"),
                                children: [
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(
                                        _Radio_OrderRadio__WEBPACK_IMPORTED_MODULE_2__.Z,
                                        { value: value, setValue: setValue }
                                    ),
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(
                                        "div",
                                        {
                                            style: {
                                                marginTop: 30,
                                                display: "flex",
                                                justifyContent: "space-between",
                                            },
                                            children: [
                                                (0,
                                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(
                                                    _AletheiaModal_style__WEBPACK_IMPORTED_MODULE_3__.IB,
                                                    {
                                                        type: "text",
                                                        onClick: handleCancel,
                                                        children: (0,
                                                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(
                                                            "span",
                                                            {
                                                                style: {
                                                                    textDecorationLine:
                                                                        "underline",
                                                                },
                                                                children: t(
                                                                    "orderModal:cancelButton"
                                                                ),
                                                            }
                                                        ),
                                                    }
                                                ),
                                                (0,
                                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(
                                                    _Button__WEBPACK_IMPORTED_MODULE_1__.Z,
                                                    {
                                                        type: _Button__WEBPACK_IMPORTED_MODULE_1__
                                                            .L.blue,
                                                        onClick: handleOk,
                                                        children: t(
                                                            "orderModal:okButton"
                                                        ),
                                                    }
                                                ),
                                            ],
                                        }
                                    ),
                                ],
                            }
                        );
                    });
            (OrderModal.displayName = "OrderModal"),
                (__webpack_exports__.Z = OrderModal);
            try {
                (OrderModal.displayName = "OrderModal"),
                    (OrderModal.__docgenInfo = {
                        description: "",
                        displayName: "OrderModal",
                        props: {
                            visible: {
                                defaultValue: null,
                                description: "",
                                name: "visible",
                                required: !0,
                                type: { name: "any" },
                            },
                            value: {
                                defaultValue: null,
                                description: "",
                                name: "value",
                                required: !0,
                                type: { name: "any" },
                            },
                            setValue: {
                                defaultValue: null,
                                description: "",
                                name: "setValue",
                                required: !0,
                                type: { name: "any" },
                            },
                            handleOk: {
                                defaultValue: null,
                                description: "",
                                name: "handleOk",
                                required: !0,
                                type: { name: "any" },
                            },
                            handleCancel: {
                                defaultValue: null,
                                description: "",
                                name: "handleCancel",
                                required: !0,
                                type: { name: "any" },
                            },
                        },
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/Modal/OrderModal.tsx#OrderModal"
                        ] = {
                            docgenInfo: OrderModal.__docgenInfo,
                            name: "OrderModal",
                            path: "src/components/Modal/OrderModal.tsx#OrderModal",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
        },
        "./src/components/Radio/OrderRadio.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__("./node_modules/antd/lib/space/style/index.js");
            var antd_lib_space__WEBPACK_IMPORTED_MODULE_8__ =
                    __webpack_require__(
                        "./node_modules/antd/lib/space/index.js"
                    ),
                antd_lib_radio__WEBPACK_IMPORTED_MODULE_6__ =
                    (__webpack_require__(
                        "./node_modules/antd/lib/radio/style/index.js"
                    ),
                    __webpack_require__(
                        "./node_modules/antd/lib/radio/index.js"
                    )),
                react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
                    "./node_modules/react/index.js"
                ),
                styled_components__WEBPACK_IMPORTED_MODULE_5__ =
                    __webpack_require__(
                        "./node_modules/styled-components/dist/styled-components.browser.esm.js"
                    ),
                _styles_colors__WEBPACK_IMPORTED_MODULE_3__ =
                    __webpack_require__("./src/styles/colors.ts"),
                next_i18next__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
                    "./node_modules/react-i18next/dist/es/useTranslation.js"
                ),
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ =
                    __webpack_require__("./node_modules/react/jsx-runtime.js"),
                RadioInput =
                    (react__WEBPACK_IMPORTED_MODULE_2__.createElement,
                    (0, styled_components__WEBPACK_IMPORTED_MODULE_5__.ZP)(
                        antd_lib_radio__WEBPACK_IMPORTED_MODULE_6__.ZP
                    ).withConfig({
                        displayName: "OrderRadio__RadioInput",
                        componentId: "sc-254dfa-0",
                    })(
                        [
                            "margin:10px 0 0 0;.ant-radio-checked .ant-radio-inner{border:2px solid ",
                            ";width:25px;height:25px;}.ant-radio-checked .ant-radio-inner:after{background-color:",
                            ";position:relative;top:3px;left:3px;width:31px;height:31px;}span .ant-radio-inner{box-shadow:0px 0px 6px rgba(0,0,0,0.25);width:25px;height:25px;}.ant-radio-wrapper-checked > span:nth-child(2){font-weight:700;}",
                        ],
                        _styles_colors__WEBPACK_IMPORTED_MODULE_3__.Z
                            .bluePrimary,
                        _styles_colors__WEBPACK_IMPORTED_MODULE_3__.Z
                            .bluePrimary
                    )),
                OrderRadio = function OrderRadio(_ref) {
                    var value = _ref.value,
                        setValue = _ref.setValue,
                        t = (0, next_i18next__WEBPACK_IMPORTED_MODULE_7__.$)()
                            .t;
                    return (0,
                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(
                        RadioInput.Group,
                        {
                            onChange: function onChangeRadio(e) {
                                setValue(e.target.value);
                            },
                            value: value,
                            children: (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(
                                antd_lib_space__WEBPACK_IMPORTED_MODULE_8__.default,
                                {
                                    style: { marginTop: 10 },
                                    direction: "vertical",
                                    children: [
                                        (0,
                                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(
                                            RadioInput,
                                            {
                                                value: "asc",
                                                children: (0,
                                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(
                                                    "span",
                                                    {
                                                        style: {
                                                            fontSize: 18,
                                                            marginLeft: 10,
                                                            color: _styles_colors__WEBPACK_IMPORTED_MODULE_3__
                                                                .Z
                                                                .blackSecondary,
                                                        },
                                                        children: t(
                                                            "orderModal:radioAsc"
                                                        ),
                                                    }
                                                ),
                                            }
                                        ),
                                        (0,
                                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(
                                            RadioInput,
                                            {
                                                value: "desc",
                                                children: (0,
                                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(
                                                    "span",
                                                    {
                                                        style: {
                                                            fontSize: 18,
                                                            marginLeft: 10,
                                                            color: _styles_colors__WEBPACK_IMPORTED_MODULE_3__
                                                                .Z
                                                                .blackSecondary,
                                                        },
                                                        children: t(
                                                            "orderModal:radioDesc"
                                                        ),
                                                    }
                                                ),
                                            }
                                        ),
                                    ],
                                }
                            ),
                        }
                    );
                };
            (OrderRadio.displayName = "OrderRadio"),
                (__webpack_exports__.Z = OrderRadio);
            try {
                (OrderRadio.displayName = "OrderRadio"),
                    (OrderRadio.__docgenInfo = {
                        description: "",
                        displayName: "OrderRadio",
                        props: {
                            value: {
                                defaultValue: null,
                                description: "",
                                name: "value",
                                required: !0,
                                type: {
                                    name: "enum",
                                    value: [
                                        { value: '"asc"' },
                                        { value: '"desc"' },
                                    ],
                                },
                            },
                            setValue: {
                                defaultValue: null,
                                description: "",
                                name: "setValue",
                                required: !0,
                                type: { name: "(value: string) => void" },
                            },
                        },
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/components/Radio/OrderRadio.tsx#OrderRadio"
                        ] = {
                            docgenInfo: OrderRadio.__docgenInfo,
                            name: "OrderRadio",
                            path: "src/components/Radio/OrderRadio.tsx#OrderRadio",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
        },
        "./src/components/Search/OverlaySearchInput.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, {
                Z: function () {
                    return Search_OverlaySearchInput;
                },
            });
            __webpack_require__(
                "./node_modules/core-js/modules/es.string.search.js"
            ),
                __webpack_require__(
                    "./node_modules/core-js/modules/es.regexp.exec.js"
                );
            var SearchOutlined = __webpack_require__(
                    "./node_modules/@ant-design/icons/es/icons/SearchOutlined.js"
                ),
                useTranslation = __webpack_require__(
                    "./node_modules/react-i18next/dist/es/useTranslation.js"
                ),
                react = __webpack_require__("./node_modules/react/index.js"),
                es = __webpack_require__(
                    "./node_modules/react-redux/es/index.js"
                ),
                axios = __webpack_require__("./node_modules/axios/index.js"),
                axios_default = __webpack_require__.n(axios),
                actions = __webpack_require__("./src/store/actions.ts"),
                types = __webpack_require__("./src/store/types.ts"),
                request = axios_default().create({
                    withCredentials: !0,
                    baseURL: "api/search",
                }),
                SearchApi = {
                    getResults: function getResults(dispatch) {
                        var options =
                                arguments.length > 1 && void 0 !== arguments[1]
                                    ? arguments[1]
                                    : {},
                            params = {
                                type: options.type,
                                searchText: options.searchText,
                                page: options.page ? options.page : 0,
                                pageSize: options.pageSize
                                    ? options.pageSize
                                    : 5,
                            };
                        return request
                            .get("/", { params: params })
                            .then(function (response) {
                                var _response$data = response.data,
                                    personalities =
                                        _response$data.personalities,
                                    sentences = _response$data.sentences,
                                    claims = _response$data.claims;
                                params.type === types.a.AUTOCOMPLETE
                                    ? dispatch({
                                          type: types.M.RESULTS_AUTOCOMPLETE,
                                          results: {
                                              personalities: personalities,
                                              sentences: sentences,
                                              claims: claims,
                                          },
                                      })
                                    : (dispatch(actions.Z.openResultsOverlay()),
                                      dispatch({
                                          type: types.M.SEARCH_RESULTS,
                                          results: {
                                              personalities: personalities,
                                              sentences: sentences,
                                              claims: claims,
                                          },
                                      }));
                            })
                            .catch(function (e) {});
                    },
                },
                searchApi = SearchApi,
                store = __webpack_require__("./src/store/store.ts"),
                InputSearch = __webpack_require__(
                    "./src/components/Form/InputSearch.tsx"
                ),
                jsx_runtime = __webpack_require__(
                    "./node_modules/react/jsx-runtime.js"
                ),
                OverlaySearchInput =
                    (react.createElement,
                    function OverlaySearchInput() {
                        var t = (0, useTranslation.$)().t,
                            dispatch = (0, es.I0)(),
                            _useAppSelector = (0, store.CG)(function (state) {
                                var _state$search, _state$search2;
                                return {
                                    page:
                                        (null == state ||
                                        null ===
                                            (_state$search = state.search) ||
                                        void 0 === _state$search
                                            ? void 0
                                            : _state$search.searchCurPage) || 1,
                                    pageSize:
                                        (null == state ||
                                        null ===
                                            (_state$search2 = state.search) ||
                                        void 0 === _state$search2
                                            ? void 0
                                            : _state$search2.searchPageSize) ||
                                        5,
                                };
                            }),
                            page = _useAppSelector.page,
                            pageSize = _useAppSelector.pageSize;
                        return (0, jsx_runtime.jsx)(InputSearch.Z, {
                            placeholder: t("header:search_placeholder"),
                            callback: function handleInputSearch(name) {
                                dispatch({
                                    type: types.M.SET_SEARCH_NAME,
                                    searchName: name,
                                }),
                                    searchApi.getResults(dispatch, {
                                        page: page,
                                        pageSize: pageSize,
                                        searchText: name,
                                    });
                            },
                            suffix: (0, jsx_runtime.jsx)(SearchOutlined.Z, {}),
                            "data-cy": "testInputSearchOverlay",
                        });
                    });
            OverlaySearchInput.displayName = "OverlaySearchInput";
            var Search_OverlaySearchInput = OverlaySearchInput;
        },
        "./src/constants/reviewColors.js": function (
            __unused_webpack_module,
            __webpack_exports__
        ) {
            "use strict";
            __webpack_exports__.Z = {
                "not-fact": "#006060",
                trustworthy: "#008000",
                "trustworthy-but": "#5A781D",
                arguable: "#9F6B3F",
                misleading: "#D6395F",
                false: "#D32B20",
                unsustainable: "#A74165",
                exaggerated: "#B8860B",
                unverifiable: "#C9502A",
            };
        },
        "./src/lib/umami.ts": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, {
                dJ: function () {
                    return trackUmamiEvent;
                },
            });
            var trackUmamiEvent = function trackUmamiEvent(eventName) {
                var _window$umami,
                    eventGroup =
                        arguments.length > 1 && void 0 !== arguments[1]
                            ? arguments[1]
                            : "click";
                window.umami &&
                    (null === (_window$umami = window.umami) ||
                        void 0 === _window$umami ||
                        _window$umami.trackEvent(eventName, eventGroup));
            };
        },
        "./src/store/actions.ts": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    "./src/store/types.ts"
                ),
                actions = {
                    openResultsOverlay: function openResultsOverlay() {
                        return {
                            type: _types__WEBPACK_IMPORTED_MODULE_0__.M
                                .RESULTS_OVERLAY_VISIBLE,
                            overlayVisible: !0,
                        };
                    },
                    closeResultsOverlay: function closeResultsOverlay() {
                        return {
                            type: _types__WEBPACK_IMPORTED_MODULE_0__.M
                                .RESULTS_OVERLAY_VISIBLE,
                            overlayVisible: !1,
                        };
                    },
                    openSideMenu: function openSideMenu() {
                        return {
                            type: _types__WEBPACK_IMPORTED_MODULE_0__.M
                                .TOGGLE_MENU,
                            menuCollapsed: !1,
                        };
                    },
                    closeSideMenu: function closeSideMenu() {
                        return {
                            type: _types__WEBPACK_IMPORTED_MODULE_0__.M
                                .TOGGLE_MENU,
                            menuCollapsed: !0,
                        };
                    },
                    openReviewDrawer: function openReviewDrawer() {
                        return {
                            type: _types__WEBPACK_IMPORTED_MODULE_0__.M
                                .TOGGLE_REVIEW_DRAWER,
                            reviewDrawerCollapsed: !1,
                        };
                    },
                    closeReviewDrawer: function closeReviewDrawer() {
                        return {
                            type: _types__WEBPACK_IMPORTED_MODULE_0__.M
                                .TOGGLE_REVIEW_DRAWER,
                            reviewDrawerCollapsed: !0,
                        };
                    },
                    setSelectPersonality: function setSelectPersonality(
                        personality
                    ) {
                        return {
                            type: _types__WEBPACK_IMPORTED_MODULE_0__.M
                                .SET_SELECTED_PERSONALITY,
                            selectedPersonality: personality,
                        };
                    },
                    setSelectClaim: function setSelectClaim(claim) {
                        return {
                            type: _types__WEBPACK_IMPORTED_MODULE_0__.M
                                .SET_SELECTED_CLAIM,
                            selectedClaim: claim,
                        };
                    },
                    setSelectContent: function setSelectContent(content) {
                        return {
                            type: _types__WEBPACK_IMPORTED_MODULE_0__.M
                                .SET_SELECTED_CONTENT,
                            selectedContent: content,
                            selectedDataHash:
                                (null == content
                                    ? void 0
                                    : content.data_hash) || "",
                        };
                    },
                    setSitekey: function setSitekey(sitekey) {
                        return {
                            type: _types__WEBPACK_IMPORTED_MODULE_0__.M
                                .SET_SITEKEY,
                            sitekey: sitekey,
                        };
                    },
                };
            __webpack_exports__.Z = actions;
        },
        "./src/store/store.ts": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, {
                CG: function () {
                    return useAppSelector;
                },
                oR: function () {
                    return useStore;
                },
            });
            __webpack_require__(
                "./node_modules/core-js/modules/es.object.assign.js"
            ),
                __webpack_require__(
                    "./node_modules/core-js/modules/es.string.search.js"
                ),
                __webpack_require__(
                    "./node_modules/core-js/modules/es.regexp.exec.js"
                );
            var store,
                _types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
                    "./src/store/types.ts"
                ),
                react_redux__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
                    "./node_modules/react-redux/es/index.js"
                ),
                redux__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
                    "./node_modules/redux/es/redux.js"
                ),
                react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
                    "./node_modules/react/index.js"
                ),
                reducer = function reducer(state, action) {
                    switch (action.type) {
                        case _types__WEBPACK_IMPORTED_MODULE_3__.M.TOGGLE_MENU:
                            return Object.assign({}, state, {
                                menuCollapsed: action.menuCollapsed,
                            });
                        case _types__WEBPACK_IMPORTED_MODULE_3__.M
                            .TOGGLE_REVIEW_DRAWER:
                            return Object.assign({}, state, {
                                reviewDrawerCollapsed:
                                    action.reviewDrawerCollapsed,
                            });
                        case _types__WEBPACK_IMPORTED_MODULE_3__.M
                            .SET_TOTAL_RESULTS:
                            return Object.assign({}, state, {
                                search: Object.assign(
                                    {},
                                    (null == state ? void 0 : state.search) ||
                                        {},
                                    { totalResults: action.totalResults }
                                ),
                            });
                        case _types__WEBPACK_IMPORTED_MODULE_3__.M
                            .RESULTS_OVERLAY_VISIBLE:
                            return Object.assign({}, state, {
                                search: Object.assign(
                                    {},
                                    (null == state ? void 0 : state.search) ||
                                        {},
                                    { overlayVisible: action.overlayVisible }
                                ),
                            });
                        case _types__WEBPACK_IMPORTED_MODULE_3__.M
                            .RESULTS_AUTOCOMPLETE:
                            return Object.assign({}, state, {
                                search: Object.assign(
                                    {},
                                    (null == state ? void 0 : state.search) ||
                                        {},
                                    { autocompleteResults: action.results }
                                ),
                            });
                        case _types__WEBPACK_IMPORTED_MODULE_3__.M
                            .RESULTS_TOPICS_AUTOCOMPLETE:
                            return Object.assign({}, state, {
                                search: Object.assign(
                                    {},
                                    (null == state ? void 0 : state.search) ||
                                        {},
                                    {
                                        autocompleteTopicsResults:
                                            action.results,
                                    }
                                ),
                            });
                        case _types__WEBPACK_IMPORTED_MODULE_3__.M
                            .RESULTS_SEARCH_VISIBLE:
                            return Object.assign({}, state, {
                                search: Object.assign(
                                    {},
                                    (null == state ? void 0 : state.search) ||
                                        {},
                                    { resultsVisible: action.resultsVisible }
                                ),
                            });
                        case _types__WEBPACK_IMPORTED_MODULE_3__.M
                            .SEARCH_RESULTS:
                            return Object.assign({}, state, {
                                search: Object.assign(
                                    {},
                                    (null == state ? void 0 : state.search) ||
                                        {},
                                    { searchResults: action.results }
                                ),
                            });
                        case _types__WEBPACK_IMPORTED_MODULE_3__.M
                            .SET_TOTAL_PAGES:
                            return Object.assign({}, state, {
                                search: Object.assign(
                                    {},
                                    (null == state ? void 0 : state.search) ||
                                        {},
                                    { searchTotalPages: action.totalPages }
                                ),
                            });
                        case _types__WEBPACK_IMPORTED_MODULE_3__.M.SET_CUR_PAGE:
                            return Object.assign({}, state, {
                                search: Object.assign(
                                    {},
                                    (null == state ? void 0 : state.search) ||
                                        {},
                                    { searchCurPage: action.page }
                                ),
                            });
                        case _types__WEBPACK_IMPORTED_MODULE_3__.M
                            .SET_PAGE_SIZE:
                            return Object.assign({}, state, {
                                search: Object.assign(
                                    {},
                                    (null == state ? void 0 : state.search) ||
                                        {},
                                    { searchPageSize: action.pageSize }
                                ),
                            });
                        case _types__WEBPACK_IMPORTED_MODULE_3__.M
                            .SET_SEARCH_NAME:
                            return Object.assign({}, state, {
                                search: Object.assign(
                                    {},
                                    (null == state ? void 0 : state.search) ||
                                        {},
                                    { searchInput: action.searchName }
                                ),
                            });
                        case _types__WEBPACK_IMPORTED_MODULE_3__.M
                            .SET_SEARCH_FILTER:
                            return Object.assign({}, state, {
                                search: Object.assign(
                                    {},
                                    (null == state ? void 0 : state.search) ||
                                        {},
                                    { searchFilter: action.filters }
                                ),
                            });
                        case _types__WEBPACK_IMPORTED_MODULE_3__.M
                            .SET_SEARCH_FILTER_USED:
                            return Object.assign({}, state, {
                                search: Object.assign(
                                    {},
                                    (null == state ? void 0 : state.search) ||
                                        {},
                                    { searchFilterUsed: action.filterUsed }
                                ),
                            });
                        case _types__WEBPACK_IMPORTED_MODULE_3__.M
                            .SET_LOGIN_STATUS:
                            return Object.assign({}, state, {
                                login: action.login,
                            });
                        case _types__WEBPACK_IMPORTED_MODULE_3__.M
                            .SET_AUTO_SAVE:
                            return Object.assign({}, state, {
                                autoSave: action.autoSave,
                            });
                        case _types__WEBPACK_IMPORTED_MODULE_3__.M
                            .SET_COLLABORATIVE_EDIT:
                            return Object.assign({}, state, {
                                enableCollaborativeEdit:
                                    action.enableCollaborativeEdit,
                            });
                        case _types__WEBPACK_IMPORTED_MODULE_3__.M
                            .SET_USER_ROLE:
                            return Object.assign({}, state, {
                                role: action.role,
                            });
                        case _types__WEBPACK_IMPORTED_MODULE_3__.M
                            .SET_BREAKPOINTS:
                            return Object.assign({}, state, { vw: action.vw });
                        case _types__WEBPACK_IMPORTED_MODULE_3__.M
                            .SET_CLAIM_CREATE_TYPE:
                            return Object.assign({}, state, {
                                claimType: action.claimType,
                            });
                        case _types__WEBPACK_IMPORTED_MODULE_3__.M
                            .SET_CLAIM_CREATE_PERSONALITY:
                            return Object.assign({}, state, {
                                claimPersonality: action.claimPersonality,
                            });
                        case _types__WEBPACK_IMPORTED_MODULE_3__.M
                            .SET_SELECTED_PERSONALITY:
                            return Object.assign({}, state, {
                                selectedPersonality: action.selectedPersonality,
                            });
                        case _types__WEBPACK_IMPORTED_MODULE_3__.M
                            .SET_SELECTED_CLAIM:
                            return Object.assign({}, state, {
                                selectedClaim: action.selectedClaim,
                            });
                        case _types__WEBPACK_IMPORTED_MODULE_3__.M
                            .SET_SELECTED_CONTENT:
                            return Object.assign({}, state, {
                                selectedContent: action.selectedContent,
                                selectedDataHash: action.selectedDataHash,
                            });
                        case _types__WEBPACK_IMPORTED_MODULE_3__.M.SET_USER_ID:
                            return Object.assign({}, state, {
                                userId: action.userId,
                            });
                        case _types__WEBPACK_IMPORTED_MODULE_3__.M.SET_SITEKEY:
                            return Object.assign({}, state, {
                                sitekey: action.sitekey,
                            });
                        default:
                            return state;
                    }
                };
            function initStore(preloadedState) {
                return (0, redux__WEBPACK_IMPORTED_MODULE_6__.MT)(
                    reducer,
                    preloadedState,
                    (0, redux__WEBPACK_IMPORTED_MODULE_6__.md)()
                );
            }
            function useStore() {
                return (0, react__WEBPACK_IMPORTED_MODULE_5__.useMemo)(
                    function () {
                        return (function initializeStore(preloadedState) {
                            var _store2,
                                _store =
                                    null !== (_store2 = store) &&
                                    void 0 !== _store2
                                        ? _store2
                                        : initStore(preloadedState);
                            return (
                                preloadedState &&
                                    store &&
                                    ((_store = initStore(
                                        Object.assign(
                                            {},
                                            store.getState(),
                                            preloadedState
                                        )
                                    )),
                                    (store = void 0)),
                                "undefined" == typeof window ||
                                    store ||
                                    (store = _store),
                                _store
                            );
                        })({});
                    },
                    []
                );
            }
            var useAppSelector = react_redux__WEBPACK_IMPORTED_MODULE_4__.v9;
        },
        "./src/store/types.ts": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            var ActionTypes, SearchTypes;
            __webpack_require__.d(__webpack_exports__, {
                M: function () {
                    return ActionTypes;
                },
                a: function () {
                    return SearchTypes;
                },
            }),
                (function (ActionTypes) {
                    (ActionTypes[(ActionTypes.RESULTS_AUTOCOMPLETE = 0)] =
                        "RESULTS_AUTOCOMPLETE"),
                        (ActionTypes[(ActionTypes.TOGGLE_MENU = 1)] =
                            "TOGGLE_MENU"),
                        (ActionTypes[(ActionTypes.TOGGLE_REVIEW_DRAWER = 2)] =
                            "TOGGLE_REVIEW_DRAWER"),
                        (ActionTypes[
                            (ActionTypes.RESULTS_OVERLAY_VISIBLE = 3)
                        ] = "RESULTS_OVERLAY_VISIBLE"),
                        (ActionTypes[(ActionTypes.SEARCH_RESULTS = 4)] =
                            "SEARCH_RESULTS"),
                        (ActionTypes[(ActionTypes.SET_TOTAL_PAGES = 5)] =
                            "SET_TOTAL_PAGES"),
                        (ActionTypes[(ActionTypes.SET_CUR_PAGE = 6)] =
                            "SET_CUR_PAGE"),
                        (ActionTypes[(ActionTypes.SET_SEARCH_NAME = 7)] =
                            "SET_SEARCH_NAME"),
                        (ActionTypes[(ActionTypes.SET_LOGIN_STATUS = 8)] =
                            "SET_LOGIN_STATUS"),
                        (ActionTypes[(ActionTypes.SET_AUTO_SAVE = 9)] =
                            "SET_AUTO_SAVE"),
                        (ActionTypes[(ActionTypes.SET_BREAKPOINTS = 10)] =
                            "SET_BREAKPOINTS"),
                        (ActionTypes[(ActionTypes.SET_USER_ROLE = 11)] =
                            "SET_USER_ROLE"),
                        (ActionTypes[(ActionTypes.SET_CLAIM_CREATE_TYPE = 12)] =
                            "SET_CLAIM_CREATE_TYPE"),
                        (ActionTypes[
                            (ActionTypes.SET_CLAIM_CREATE_PERSONALITY = 13)
                        ] = "SET_CLAIM_CREATE_PERSONALITY"),
                        (ActionTypes[
                            (ActionTypes.SET_SELECTED_PERSONALITY = 14)
                        ] = "SET_SELECTED_PERSONALITY"),
                        (ActionTypes[(ActionTypes.SET_SELECTED_CLAIM = 15)] =
                            "SET_SELECTED_CLAIM"),
                        (ActionTypes[(ActionTypes.SET_SELECTED_CONTENT = 16)] =
                            "SET_SELECTED_CONTENT"),
                        (ActionTypes[(ActionTypes.SET_USER_ID = 17)] =
                            "SET_USER_ID"),
                        (ActionTypes[(ActionTypes.SET_SITEKEY = 18)] =
                            "SET_SITEKEY"),
                        (ActionTypes[
                            (ActionTypes.RESULTS_SEARCH_VISIBLE = 19)
                        ] = "RESULTS_SEARCH_VISIBLE"),
                        (ActionTypes[(ActionTypes.SET_TOTAL_RESULTS = 20)] =
                            "SET_TOTAL_RESULTS"),
                        (ActionTypes[(ActionTypes.SET_PAGE_SIZE = 21)] =
                            "SET_PAGE_SIZE"),
                        (ActionTypes[
                            (ActionTypes.RESULTS_TOPICS_AUTOCOMPLETE = 22)
                        ] = "RESULTS_TOPICS_AUTOCOMPLETE"),
                        (ActionTypes[(ActionTypes.SET_SEARCH_FILTER = 23)] =
                            "SET_SEARCH_FILTER"),
                        (ActionTypes[
                            (ActionTypes.SET_SEARCH_FILTER_USED = 24)
                        ] = "SET_SEARCH_FILTER_USED"),
                        (ActionTypes[
                            (ActionTypes.SET_COLLABORATIVE_EDIT = 25)
                        ] = "SET_COLLABORATIVE_EDIT");
                })(ActionTypes || (ActionTypes = {})),
                (function (SearchTypes) {
                    (SearchTypes[(SearchTypes.AUTOCOMPLETE = 0)] =
                        "AUTOCOMPLETE"),
                        (SearchTypes[(SearchTypes.OVERLAY = 1)] = "OVERLAY"),
                        (SearchTypes[(SearchTypes.RESULTS = 2)] = "RESULTS");
                })(SearchTypes || (SearchTypes = {}));
        },
        "./src/stories/ProviderWrapper.tsx": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
                    "./node_modules/react/index.js"
                ),
                react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
                    "./node_modules/react-redux/es/index.js"
                ),
                _store_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
                    "./src/store/store.ts"
                ),
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ =
                    __webpack_require__("./node_modules/react/jsx-runtime.js"),
                ProviderWrapper =
                    (react__WEBPACK_IMPORTED_MODULE_0__.createElement,
                    function ProviderWrapper(_ref) {
                        var children = _ref.children,
                            store = (0,
                            _store_store__WEBPACK_IMPORTED_MODULE_2__.oR)();
                        return (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(
                            react_redux__WEBPACK_IMPORTED_MODULE_1__.zt,
                            { store: store, children: children }
                        );
                    });
            (ProviderWrapper.displayName = "ProviderWrapper"),
                (__webpack_exports__.Z = ProviderWrapper);
            try {
                (ProviderWrapper.displayName = "ProviderWrapper"),
                    (ProviderWrapper.__docgenInfo = {
                        description: "",
                        displayName: "ProviderWrapper",
                        props: {},
                    }),
                    "undefined" != typeof STORYBOOK_REACT_CLASSES &&
                        (STORYBOOK_REACT_CLASSES[
                            "src/stories/ProviderWrapper.tsx#ProviderWrapper"
                        ] = {
                            docgenInfo: ProviderWrapper.__docgenInfo,
                            name: "ProviderWrapper",
                            path: "src/stories/ProviderWrapper.tsx#ProviderWrapper",
                        });
            } catch (__react_docgen_typescript_loader_error) {}
        },
        "./src/stories/fixtures.ts": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, {
                Ep: function () {
                    return personality;
                },
                QS: function () {
                    return claim;
                },
                fy: function () {
                    return getStats;
                },
                xt: function () {
                    return classifications;
                },
            });
            var classifications = [
                    "trustworthy",
                    "trustworthy-but",
                    "arguable",
                    "misleading",
                    "false",
                    "unsustainable",
                    "exaggerated",
                    "not-fact",
                    "unverifiable",
                ],
                getStats = function getStats(count) {
                    var stats = [];
                    if (count <= 0) return stats;
                    for (var i = 0; i < count; i++)
                        stats.push({
                            _id: classifications[i],
                            percentage: 100 / count,
                            count: 1,
                        });
                    return stats;
                },
                claim = {
                    content: {
                        object: [
                            {
                                type: "paragraph",
                                props: { id: 1 },
                                content: [
                                    {
                                        type: "sentence",
                                        props: {
                                            id: 1,
                                            "data-hash":
                                                "18fee621a631d5576d503c319a35b42a",
                                        },
                                        content:
                                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                                    },
                                    {
                                        type: "sentence",
                                        props: {
                                            id: 2,
                                            "data-hash":
                                                "92bae8ec20aa0fc21d1c33a79b00e6a5",
                                        },
                                        content:
                                            "Nullam malesuada viverra sagittis.",
                                    },
                                ],
                            },
                            {
                                type: "paragraph",
                                props: { id: 2 },
                                content: [
                                    {
                                        type: "sentence",
                                        props: {
                                            id: 15,
                                            "data-hash":
                                                "86b485a74f89c6aaff463f166171cdb2",
                                        },
                                        content:
                                            "Duis euismod, mi vel euismod sodales, tellus felis malesuada sem, id posuere tortor elit in tellus.",
                                    },
                                    {
                                        type: "sentence",
                                        props: {
                                            id: 16,
                                            "data-hash":
                                                "d631234a9773fcbc33173c601d74cc3a",
                                        },
                                        content:
                                            "Vivamus luctus vestibulum lacinia.",
                                    },
                                ],
                            },
                        ],
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Nullam malesuada viverra sagittis.Maecenas scelerisque massa quis ultricies rhoncus.Vestibulum ac lobortis odio.Integer accumsan convallis pulvinar.Vivamus sed turpis vel orci egestas pharetra.Sed interdum orci nisl, euismod pharetra est interdum ut. Phasellus non metus aliquam, placerat turpis ultrices, fermentum libero.In quis sollicitudin diam.Integer fermentum lobortis convallis.Nunc sit amet est bibendum, vestibulum orci eu, tristique magna.Integer viverra enim vitae lacus gravida venenatis.Aliquam a nisi cursus, vehicula erat eu, accumsan metus.Vestibulum nisl libero, consectetur nec ullamcorper quis, fringilla eget enim.Mauris eget maximus elit, eget vehicula lorem.Duis euismod, mi vel euismod sodales, tellus felis malesuada sem, id posuere tortor elit in tellus.Vivamus luctus vestibulum lacinia.Vestibulum bibendum condimentum sapien, id ultricies nulla lobortis ac.Quisque eget tortor venenatis, aliquam mi in, commodo nunc.Praesent porta lobortis neque, sed ullamcorper ligula rutrum varius.Vivamus lobortis mauris sit amet tortor fermentum volutpat.Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.Nulla bibendum odio lorem, sed vulputate turpis tempus ut. Morbi vehicula enim et scelerisque pulvinar.Ut eget lacus scelerisque, consequat dui eget, facilisis nibh.",
                    },
                    title: "Lipsum",
                    date: "2022-04-10T13:05:49.334Z",
                },
                personality = {
                    name: "Personality name",
                    description: "Personality description",
                    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/245px-President_Barack_Obama.jpg",
                    slug: "personality-name",
                    stats: {
                        total: 1,
                        reviews: [{ _id: "true", percentage: 100, count: 1 }],
                    },
                    claims: [claim],
                };
        },
        "./src/styles/colors.ts": function (
            __unused_webpack_module,
            __webpack_exports__
        ) {
            "use strict";
            __webpack_exports__.Z = {
                bluePrimary: "rgb(17, 39, 58)",
                blueSecondary: "rgb(101, 126, 142)",
                blueTertiary: "rgb(156, 189, 210)",
                blueQuartiary: "rgb(177, 194, 205)",
                grayPrimary: "rgb(76, 77, 78)",
                graySecondary: "rgb(151, 154, 155)",
                grayTertiary: "rgb(194, 200, 204)",
                lightGray: "rgb(245, 245, 245)",
                lightGraySecondary: "rgb(238, 238, 238)",
                lightBluePrimary: "rgb(218, 232, 234)",
                lightBlueSecondary: "rgb(103, 190, 242)",
                white: "rgb(255, 255, 255)",
                blackPrimary: "rgb(17, 17, 17)",
                blackSecondary: "rgb(81, 81, 81)",
                lightYellow: "rgba(219, 159, 13, 0.3)",
                logoWhite: "#E8E8E8",
                redText: "#ff4d4f",
                warning: "#DB9F0D",
            };
        },
        "./src/styles/mediaQueries.ts": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__.d(__webpack_exports__, {
                o$: function () {
                    return queries;
                },
            });
            var breakpoints_lg = 1200,
                queries = {
                    xs: "(max-width: " + (576 - 1) + "px)",
                    sm: "(max-width: " + (768 - 1) + "px)",
                    md: "(max-width: " + (992 - 1) + "px)",
                    lg: "(max-width: " + (breakpoints_lg - 1) + "px)",
                    xl: "(min-width: " + breakpoints_lg + "px)",
                };
        },
        "./src/types/enums.ts": function (
            __unused_webpack_module,
            __webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            var ClassificationEnum, Roles, ContentModelEnum;
            __webpack_require__.d(__webpack_exports__, {
                BN: function () {
                    return ContentModelEnum;
                },
                G7: function () {
                    return Roles;
                },
            }),
                (function (ClassificationEnum) {
                    (ClassificationEnum[(ClassificationEnum["not-fact"] = 0)] =
                        "not-fact"),
                        (ClassificationEnum[(ClassificationEnum.false = 1)] =
                            "false"),
                        (ClassificationEnum[
                            (ClassificationEnum.misleading = 2)
                        ] = "misleading"),
                        (ClassificationEnum[
                            (ClassificationEnum.unsustainable = 3)
                        ] = "unsustainable"),
                        (ClassificationEnum[
                            (ClassificationEnum.unverifiable = 4)
                        ] = "unverifiable"),
                        (ClassificationEnum[
                            (ClassificationEnum.exaggerated = 5)
                        ] = "exaggerated"),
                        (ClassificationEnum[(ClassificationEnum.arguable = 6)] =
                            "arguable"),
                        (ClassificationEnum[
                            (ClassificationEnum["trustworthy-but"] = 7)
                        ] = "trustworthy-but"),
                        (ClassificationEnum[
                            (ClassificationEnum.trustworthy = 8)
                        ] = "trustworthy");
                })(ClassificationEnum || (ClassificationEnum = {})),
                (function (Roles) {
                    (Roles.Regular = "regular"),
                        (Roles.FactChecker = "fact-checker"),
                        (Roles.Admin = "admin");
                })(Roles || (Roles = {})),
                (function (ContentModelEnum) {
                    (ContentModelEnum.Speech = "Speech"),
                        (ContentModelEnum.Image = "Image"),
                        (ContentModelEnum.Debate = "Debate");
                })(ContentModelEnum || (ContentModelEnum = {}));
        },
        "./storybook-init-framework-entry.js": function (
            __unused_webpack_module,
            __unused_webpack___webpack_exports__,
            __webpack_require__
        ) {
            "use strict";
            __webpack_require__(
                "./node_modules/@storybook/react/dist/esm/client/index.js"
            );
        },
        "./src/stories sync recursive ^\\.(?:(?:^%7C\\/%7C(?:(?:(?%21(?:^%7C\\/)\\.).)*?)\\/)(?%21\\.)(?=.)[^/]*?\\.stories\\.[^/]*?\\/?)$":
            function (module, __unused_webpack_exports, __webpack_require__) {
                var map = {
                    "./components/CTARegistration.stories.tsx":
                        "./src/stories/components/CTARegistration.stories.tsx",
                    "./components/baseList/OrderModal.stories.tsx":
                        "./src/stories/components/baseList/OrderModal.stories.tsx",
                    "./components/baseList/OrderRadio.stories.tsx":
                        "./src/stories/components/baseList/OrderRadio.stories.tsx",
                    "./components/baseList/SortByButton.stories.tsx":
                        "./src/stories/components/baseList/SortByButton.stories.tsx",
                    "./components/buttons/AffixButton.stories.tsx":
                        "./src/stories/components/buttons/AffixButton.stories.tsx",
                    "./components/buttons/AletheiaButton.stories.tsx":
                        "./src/stories/components/buttons/AletheiaButton.stories.tsx",
                    "./components/buttons/BackButton.stories.tsx":
                        "./src/stories/components/buttons/BackButton.stories.tsx",
                    "./components/buttons/SocialMediaShare.stories.tsx":
                        "./src/stories/components/buttons/SocialMediaShare.stories.tsx",
                    "./components/buttons/ToggleSection.stories.tsx":
                        "./src/stories/components/buttons/ToggleSection.stories.tsx",
                    "./components/claim/ClaimCard.stories.tsx":
                        "./src/stories/components/claim/ClaimCard.stories.tsx",
                    "./components/claim/ClaimCardHeader.stories.tsx":
                        "./src/stories/components/claim/ClaimCardHeader.stories.tsx",
                    "./components/claim/ClaimSentence.stories.tsx":
                        "./src/stories/components/claim/ClaimSentence.stories.tsx",
                    "./components/claim/ClaimSentenceCard.stories.tsx":
                        "./src/stories/components/claim/ClaimSentenceCard.stories.tsx",
                    "./components/inputs/AletheiaInput.stories.tsx":
                        "./src/stories/components/inputs/AletheiaInput.stories.tsx",
                    "./components/inputs/ClaimReviewSelect.stories.tsx":
                        "./src/stories/components/inputs/ClaimReviewSelect.stories.tsx",
                    "./components/inputs/InputPassword.stories.tsx":
                        "./src/stories/components/inputs/InputPassword.stories.tsx",
                    "./components/inputs/InputSearch.stories.tsx":
                        "./src/stories/components/inputs/InputSearch.stories.tsx",
                    "./components/inputs/SourceInput.stories.tsx":
                        "./src/stories/components/inputs/SourceInput.stories.tsx",
                    "./components/inputs/TextArea.stories.tsx":
                        "./src/stories/components/inputs/TextArea.stories.tsx",
                    "./components/layout/AletheiaMenu.stories.tsx":
                        "./src/stories/components/layout/AletheiaMenu.stories.tsx",
                    "./components/layout/AletheiaSocialMediaFooter.stories.tsx":
                        "./src/stories/components/layout/AletheiaSocialMediaFooter.stories.tsx",
                    "./components/layout/CardBase.stories.tsx":
                        "./src/stories/components/layout/CardBase.stories.tsx",
                    "./components/layout/HeaderContent.stories.tsx":
                        "./src/stories/components/layout/HeaderContent.stories.tsx",
                    "./components/layout/Logo.stories.tsx":
                        "./src/stories/components/layout/Logo.stories.tsx",
                    "./components/layout/SearchOverlay.stories.tsx":
                        "./src/stories/components/layout/SearchOverlay.stories.tsx",
                    "./components/layout/Sidebar.stories.tsx":
                        "./src/stories/components/layout/Sidebar.stories.tsx",
                    "./components/metrics/MetricsOverview.stories.tsx":
                        "./src/stories/components/metrics/MetricsOverview.stories.tsx",
                    "./components/metrics/ReviewStats.stories.tsx":
                        "./src/stories/components/metrics/ReviewStats.stories.tsx",
                    "./components/personality/PersonalityCard.stories.tsx":
                        "./src/stories/components/personality/PersonalityCard.stories.tsx",
                    "./components/personality/PersonalityCreateCTA.stories.tsx":
                        "./src/stories/components/personality/PersonalityCreateCTA.stories.tsx",
                    "./components/sentenceReport/SentenceReportSummary.stories.tsx":
                        "./src/stories/components/sentenceReport/SentenceReportSummary.stories.tsx",
                    "./components/typography/ClassificationText.stories.tsx":
                        "./src/stories/components/typography/ClassificationText.stories.tsx",
                    "./components/typography/HighlightedSearchText.stories.tsx":
                        "./src/stories/components/typography/HighlightedSearchText.stories.tsx",
                    "./components/typography/Label.stories.tsx":
                        "./src/stories/components/typography/Label.stories.tsx",
                    "./components/typography/LocalizedDate.stories.tsx":
                        "./src/stories/components/typography/LocalizedDate.stories.tsx",
                    "./components/typography/Subtitle.stories.tsx":
                        "./src/stories/components/typography/Subtitle.stories.tsx",
                };
                function webpackContext(req) {
                    var id = webpackContextResolve(req);
                    return __webpack_require__(id);
                }
                function webpackContextResolve(req) {
                    if (!__webpack_require__.o(map, req)) {
                        var e = new Error("Cannot find module '" + req + "'");
                        throw ((e.code = "MODULE_NOT_FOUND"), e);
                    }
                    return map[req];
                }
                (webpackContext.keys = function webpackContextKeys() {
                    return Object.keys(map);
                }),
                    (webpackContext.resolve = webpackContextResolve),
                    (module.exports = webpackContext),
                    (webpackContext.id =
                        "./src/stories sync recursive ^\\.(?:(?:^%7C\\/%7C(?:(?:(?%21(?:^%7C\\/)\\.).)*?)\\/)(?%21\\.)(?=.)[^/]*?\\.stories\\.[^/]*?\\/?)$");
            },
        "?4f7e": function () {},
        "./generated-stories-entry.cjs": function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            "use strict";
            (module = __webpack_require__.nmd(module)),
                (0,
                __webpack_require__(
                    "./node_modules/@storybook/react/dist/esm/client/index.js"
                ).configure)(
                    [
                        __webpack_require__(
                            "./src/stories sync recursive ^\\.(?:(?:^%7C\\/%7C(?:(?:(?%21(?:^%7C\\/)\\.).)*?)\\/)(?%21\\.)(?=.)[^/]*?\\.stories\\.[^/]*?\\/?)$"
                        ),
                    ],
                    module,
                    !1
                );
        },
    },
    function (__webpack_require__) {
        var __webpack_exec__ = function (moduleId) {
            return __webpack_require__((__webpack_require__.s = moduleId));
        };
        __webpack_require__.O(0, [945], function () {
            return (
                __webpack_exec__(
                    "./node_modules/@storybook/react/node_modules/@storybook/core-client/dist/esm/globals/polyfills.js"
                ),
                __webpack_exec__(
                    "./node_modules/@storybook/react/node_modules/@storybook/core-client/dist/esm/globals/globals.js"
                ),
                __webpack_exec__("./storybook-init-framework-entry.js"),
                __webpack_exec__(
                    "./node_modules/@storybook/react/dist/esm/client/docs/config-generated-config-entry.js"
                ),
                __webpack_exec__(
                    "./node_modules/@storybook/react/dist/esm/client/preview/config-generated-config-entry.js"
                ),
                __webpack_exec__(
                    "./node_modules/@storybook/addon-links/preview.js-generated-config-entry.js"
                ),
                __webpack_exec__(
                    "./node_modules/@storybook/addon-docs/preview.js-generated-config-entry.js"
                ),
                __webpack_exec__(
                    "./node_modules/@storybook/addon-actions/preview.js-generated-config-entry.js"
                ),
                __webpack_exec__(
                    "./node_modules/@storybook/addon-backgrounds/preview.js-generated-config-entry.js"
                ),
                __webpack_exec__(
                    "./node_modules/@storybook/addon-measure/preview.js-generated-config-entry.js"
                ),
                __webpack_exec__(
                    "./node_modules/@storybook/addon-outline/preview.js-generated-config-entry.js"
                ),
                __webpack_exec__(
                    "./node_modules/@storybook/addon-interactions/preview.js-generated-config-entry.js"
                ),
                __webpack_exec__(
                    "./node_modules/storybook-addon-next-router/dist/preset/addDecorator.js-generated-config-entry.js"
                ),
                __webpack_exec__(
                    "./.storybook/preview.js-generated-config-entry.js"
                ),
                __webpack_exec__("./generated-stories-entry.cjs")
            );
        });
        __webpack_require__.O();
    },
]);
