/*
 * Copyright Laura Taylor
 * (https://github.com/techstreams/TSFormBot)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/* 
 * This function adds a 'TSFormBot' menu to the active form when opened
 */
function onOpen() {
   FormApp.getUi().createMenu('TSFormBot')
          .addItem('🕜 Enable Bot', 'TSFormBot.enableBot')
          .addToUi();
};

/* 
 * TSFormBot Class - Google Form Notifications
 */
class TSFormBot {

  /* 
   * Constructor function
   */
  constructor() {
    const self = this;
    self.form = FormApp.getActiveForm();
  }
  
  /* 
   * This static method sets the Hangouts Chat Room Webhook URL and configures the form submit trigger
   * @param {string} triggerFunction - name of trigger function to execute on form submission
   */
  static enableBot(triggerFunction = 'TSFormBot.postToRoom') {
    const ui = FormApp.getUi(),
          url = ui.prompt('Webhook URL', 'Enter Chat Room Webhook URL', FormApp.getUi().ButtonSet.OK).getResponseText();
    let submitTriggers;
    if (url !== '' && url.match(/^https:\/\/chat\.googleapis\.com/)) {
      submitTriggers = ScriptApp.getProjectTriggers()
        .filter(trigger => trigger.getEventType() === ScriptApp.EventType.ON_FORM_SUBMIT && trigger.getHandlerFunction() === triggerFunction);   
      if (submitTriggers.length < 1) {
        ScriptApp.newTrigger(triggerFunction).forForm(FormApp.getActiveForm()).onFormSubmit().create();
      }
      PropertiesService.getScriptProperties().setProperty('WEBHOOK_URL', url);
      ui.alert('TSFormBot Configuration COMPLETE.\n\nClick "Ok" to continue.');
    } else {
      ui.alert('TSFormBot Configuration FAILED!.\n\nInvalid Chat Room Webhook URL.\n\nPlease enter a valid url.');
    }  
  }
  
  /* 
   * This static method processes the form submission and posts a form notification to the Hangouts Chat Room
   * @param {Object} e - event object passed to the form submit function
   */
   static postToRoom(e) {
     const tsfb = new TSFormBot(),
           url = PropertiesService.getScriptProperties().getProperty('WEBHOOK_URL');
     if (url) {
       try {
         const payload = tsfb.getResponse_(e);
         const options = {
           'method' : 'post',
           'contentType': 'application/json; charset=UTF-8',
           'payload' : JSON.stringify(payload)
         };
         UrlFetchApp.fetch(url, options); 
       } catch(err) {
         console.log('TSFormBot: Error processing Bot. ' + err.message);
       }
     } else {
       console.log('TSFormBot: No Webhook URL specified for Bot');
     }
   }

  /* 
   * This method creates a 'key/value' response widget
   * @param {string} top - widget top label
   * @param {string} content - widget content
   * @param {boolean} multiline - indicates whether content can span multiple lines
   * @param {string} bottom - (optional) widget bottom label
   * @return {Object} 'key/value' widget
   */
  createKeyValueWidget_(top, content, multiline=false,icon, bottom) {
    const keyValue = {},
          widget = {};
    keyValue.topLabel = top;
    keyValue.content = content;
    keyValue.contentMultiline = multiline;
    if (bottom) {
      keyValue.bottomLabel = bottom;
    }
    if (icon) {
      keyValue.icon = icon;
    }
    widget.keyValue = keyValue;
    return widget;
  }

  /* 
   * This method creates a 'text button' response widget
   * @param {string} text - widget button text
   * @param {string} url - widget button URL
   * @return {Object} 'text button' widget
   */
  createTextBtnWidget_(text, url){
    const widget = {},
          textBtn = {},
          click = {};
    click.openLink = {url: url};
    textBtn.text = text;
    textBtn.onClick = click;
    widget.textButton = textBtn;
    return widget;
  }

  /* 
   * This method creates a 'text' response widget
   * @param {string} text - widget text
   * @return {Object} 'text' widget
   */
  createTextWidget_(text) {
    const widget = {},
          textParagraph = {};
    textParagraph.text = text;
    widget.textParagraph = textParagraph;
    return widget;
  }

  /* 
   * This method creates a response card button footer widget
   * @param {FormResponse} formResponse - form submission response
   * @return {Object} card button footer widget
   */
  getCardFooter_(formResponse) {
    const self = this,
          btns = {buttons:[]},
          widget = {widgets:[]};
    btns.buttons.push(self.createTextBtnWidget_("GO TO RESPONSE", formResponse.getEditResponseUrl()));
    btns.buttons.push(self.createTextBtnWidget_("GO TO FORM", self.form.getEditUrl()));
    widget.widgets.push(btns);
    return widget;
  }

  /* 
   * This method creates a form item response widget
   * @param {ItemResponse} ir - form item response
   * @return {Object} form item response widget
   */
  getCardFormWidget_(ir) {
    const self = this,
          item = ir.getItem(),
          title = item.getTitle(),
          itemtype = item.getType(),
          widget = {widgets:[]};
    let content, date, day, footer = null, hour, minute, month, pattern, year;
    
    switch (itemtype) {
      case FormApp.ItemType.CHECKBOX:
        content = ir.getResponse().map(i => i).join('\n');
        break;
      case FormApp.ItemType.GRID:
        content = item.asGridItem().getRows()
                      .map((r,i) => {
                         const resp = ir.getResponse()[i];
                         return `${r}: ${resp && resp !== '' ? resp : ' '}`;
                      }).join('\n');
        break;
      case FormApp.ItemType.CHECKBOX_GRID:
        content = item.asCheckboxGridItem().getRows()
                      .map((row,i) => ({name:row,val:ir.getResponse()[i]}))
                      .filter(row => row.val)
                      .map(row => `${row.name}:\n${row.val.filter(v => v !== '').map(v => `  - ${v}`).join('\n')}`)
                      .join('\n');
        break;
      case FormApp.ItemType.DATETIME:
        pattern = /^(\d{4})-(\d{2})-(\d{2})\s(\d{1,2}):(\d{2})$/;
        [, year, month, day, hour, minute] = pattern.exec(ir.getResponse());
        date = new Date(`${year}-${month}-${day}T${('0' + hour).slice(-2)}:${minute}:00`);
        content = Utilities.formatDate(date,Session.getTimeZone(),"yyyy-MM-dd   h:mm aaa");
        break;
      case FormApp.ItemType.TIME:
        pattern = /^(\d{1,2}):(\d{2})$/;
        [, hour, minute] = pattern.exec(ir.getResponse());
        date = new Date();
        date.setHours(parseInt(hour,10), parseInt(minute,10));
        content = Utilities.formatDate(date,Session.getTimeZone(),"h:mm aaa");
        break;
      case FormApp.ItemType.DURATION:
        content = `${ir.getResponse()}`;
        footer = 'Hrs : Min : Sec';
        break;
      case FormApp.ItemType.SCALE:
        const scale = item.asScaleItem();
        content = ir.getResponse();
        footer = `${scale.getLeftLabel()}(${scale.getLowerBound()}) ... ${scale.getRightLabel()}(${scale.getUpperBound()})`;
        break;
      case FormApp.ItemType.MULTIPLE_CHOICE:
      case FormApp.ItemType.LIST:
      case FormApp.ItemType.DATE:
      case FormApp.ItemType.PARAGRAPH_TEXT:
      case FormApp.ItemType.TEXT:
        content = ir.getResponse();
        break;
      default:
        content = "Unsupported form element";
    } 
    if (footer) {
      widget.widgets.push(self.createKeyValueWidget_(title, content, true, "STAR", footer));
    } else {
      widget.widgets.push(self.createKeyValueWidget_(title, content, true, "STAR")); 
    }   
    return widget;
  }

  /* 
   * This method creates a response card header widget
   * @return {Object} card header widget
   */
  getCardHeader_() {
    const widget = {};
    widget.title = "TSFormBot";
    widget.subtitle = "Form Notifications Bot";
    widget.imageUrl = "https://raw.githubusercontent.com/techstreams/TSFormBot/master/notifications.png";
    widget.imageStyle = "IMAGE";
    return widget;
  }

  /* 
   * This method creates a response card information widget
   * @return {Object} card information widget
   */
  getCardIntro_() {
    const self = this,
          date = new Date(),
          title = `<b>${self.form.getTitle()}<\/b> has a <b><font color="#ff0000">new submission!<\/font><\/b>`,
          timestamp = `<i><font color="#575655">${Utilities.formatDate(date,Session.getTimeZone(),"MM/dd/yyyy  hh:mm:ss a (z)")}`,
          widgets = [],
          widget = {};
    widgets.push(self.createTextWidget_(title));
    widgets.push(self.createTextWidget_(timestamp));
    widget.widgets = widgets;
    return widget;
  }

  /* 
   * This method creates a response card
   * @param {Object} e - event object passed to the form submit function
   * @return {Object} card response
   */
  getResponse_(e) {
    const self = this,
          formResponse = e.response,
          itemResponses = formResponse.getItemResponses(),
          sections = [],
          cards = [],
          card = {},
          response = {};
    card.header = self.getCardHeader_();
    sections.push(self.getCardIntro_());
    if (self.form.collectsEmail()) {
      sections.push({"widgets": [self.createKeyValueWidget_('Submitted By', formResponse.getRespondentEmail(), true, "STAR")]});
    }
    itemResponses.forEach(ir => {
      if(ir.getResponse()){
        sections.push(self.getCardFormWidget_(ir));
      }
    });
    sections.push(self.getCardFooter_(formResponse));
    card.sections = sections;
    cards.push(card);
    response.cards = cards;
    return response;
  }

}
