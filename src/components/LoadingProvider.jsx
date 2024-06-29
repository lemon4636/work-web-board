import React, { useState } from "react";

export default function LoadingProvider(props) {
  // console.log('LoadingProvider props===', props);
  const {
    //
    loadingPropName = "loading",
    triggerWrapper,
    triggerName = "onClick",
    children,
  } = props;

  const [loading, setLoading] = useState(false);

  return React.Children.map(children, (ele) => {
    if (
      ele &&
      typeof ele.$$typeof === "symbol" &&
      Symbol.keyFor(ele.$$typeof) === "react.element"
    ) {
      const asyncTrigger = triggerWrapper
        ? triggerWrapper.props[triggerName]
        : ele.props[triggerName];
      const trigger = async (...args) => {
        setLoading(true);
        if (!asyncTrigger) {
          setLoading(false);
          return null;
        }
        asyncTrigger(...args).finally(() => {
          setLoading(false);
        });
      };
      if (triggerWrapper) {
        return React.cloneElement(
          triggerWrapper,
          {
            ...triggerWrapper.props,
            [triggerName]: trigger,
          },
          React.cloneElement(ele, {
            ...ele.props,
            [loadingPropName]: loading,
          })
        );
      }
      return React.cloneElement(ele, {
        ...ele.props,
        [loadingPropName]: loading,
        [triggerName]: trigger,
      });
    }
    return ele;
  });
}
