(function() {

   var inputEx = YAHOO.inputEx, lang = YAHOO.lang;

/**
 * @class Adds an url regexp, and display the favicon at this url
 * @extends inputEx.StringField
 * @constructor
 * @param {Object} options inputEx.Field options object
 * <ul>
 *   <li>favicon: boolean whether the domain favicon.ico should be displayed or not (default is true, except for https)</li>
 * </ul>
 */
inputEx.UrlField = function(options) {
   inputEx.UrlField.superclass.constructor.call(this,options);
};

lang.extend(inputEx.UrlField, inputEx.StringField, 
/**
 * @scope inputEx.UrlField.prototype   
 */   
{

   /**
    * Adds the invalid Url message
    */
   setOptions: function() {
      inputEx.UrlField.superclass.setOptions.call(this);
      this.options.className = "inputEx-Field inputEx-UrlField";
      this.options.messages.invalid = inputEx.messages.invalidUrl;
      this.options.favicon = lang.isUndefined(this.options.favicon) ? (("https:" == document.location.protocol) ? false : true) : this.options.favicon;
      
      // validate with url regexp
      this.options.regexp = inputEx.regexps.url;
   },
   
   /**
    * Validate after setValue to display the favicon
    * @param {String} value The url string
    */
   setValue: function(value) {
	   inputEx.UrlField.superclass.setValue.call(this, value);
	   
	   //this.validate();
   },
   
   /**
    * Adds a img tag before the field to display the favicon
    */
   render: function() {
      inputEx.UrlField.superclass.render.call(this);
      this.el.size = 27;
      
      if(!this.options.favicon) {
         YAHOO.util.Dom.addClass(this.el, 'nofavicon');
      }

      // Create the favicon image tag
      if(this.options.favicon) {
         this.favicon = inputEx.cn('img', {src: inputEx.spacerUrl});
         this.fieldContainer.insertBefore(this.favicon,this.fieldContainer.childNodes[0]);
      }
   },
   
   /**
    * Validate the field with an url regexp and set the favicon url
    * @return {Boolean} Validation state
    */
   validate: function() {
      // check superclass validation (including regexp for url and emptiness test) 
      var url = inputEx.UrlField.superclass.validate.call(this); 
      
      if(this.options.favicon) {
         var newSrc = url ? (url[0]+"/favicon.ico") : inputEx.spacerUrl;
         if(newSrc != this.favicon.src) {
         
            // Hide the favicon
            inputEx.sn(this.favicon, null, {visibility: 'hidden'});
      
            // Change the src
            this.favicon.src = newSrc;
      
            // Set the timer to launch displayFavicon in 1s
            if(this.timer) { clearTimeout(this.timer); }
	         var that = this;
	         this.timer = setTimeout(function(){that.displayFavicon();}, 1000);
	      }
      }

      return !!url;
   },
   
   /**
    * Display the favicon if the icon was found (use of the naturalWidth property)
    */
   displayFavicon: function() {
      inputEx.sn(this.favicon, null, {visibility: (this.favicon.naturalWidth!=0) ? 'visible' : 'hidden'});
   }

});

inputEx.messages.invalidUrl = "Invalid URL, ex: http://www.test.com";


/**
 * Register this class as "url" type
 */
inputEx.registerType("url", inputEx.UrlField);

})();