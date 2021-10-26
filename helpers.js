const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
      console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
      return handlerInput.responseBuilder.getResponse();
    },
  };
  
  const ErrorHandler = {
    canHandle() {
      return true;
    },
    handle(handlerInput, error) {
      console.log(`Error handled: ${error.message}`);
      console.log(`Error stack: ${error.stack}`);
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
      return handlerInput.responseBuilder
        .speak(requestAttributes.t('ERROR_MESSAGE'))
        .reprompt(requestAttributes.t('ERROR_MESSAGE'))
        .getResponse();
    },
  };
  
  const LocalizationInterceptor = {
    process(handlerInput) {
      // Gets the locale from the request and initializes i18next.
      const localizationClient = i18n.init({
        lng: handlerInput.requestEnvelope.request.locale,
        resources: languageStrings,
        returnObjects: true
      });
      // Creates a localize function to support arguments.
      localizationClient.localize = function localize() {
        // gets arguments through and passes them to
        // i18next using sprintf to replace string placeholders
        // with arguments.
        const args = arguments;
        const value = i18n.t(...args);
        // If an array is used then a random value is selected
        if (Array.isArray(value)) {
          return value[Math.floor(Math.random() * value.length)];
        }
        return value;
      };
      // this gets the request attributes and save the localize function inside
      // it to be used in a handler by calling requestAttributes.t(STRING_ID, [args...])
      const attributes = handlerInput.attributesManager.getRequestAttributes();
      attributes.t = function translate(...args) {
        return localizationClient.localize(...args);
      }
    }
  };