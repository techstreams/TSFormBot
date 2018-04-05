/*
 * Copyright Laura Taylor
 * (https://github.com/techstreams/TSCron)
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
 * Add a custom menu to the active form
 */
function onOpen() {
   FormApp.getUi().createMenu('TSFormBot')
          .addItem('🕜 Enable Bot', 'enableBot')
          .addToUi();
};


/*
 * Enable Bot
 */
function enableBot() {
  var url = FormApp.getUi().prompt('Webhook URL', 'Enter Chat Room Webhook URL', FormApp.getUi().ButtonSet.OK).getResponseText(),
      submitTriggers;
  if (url !== '' && url.match(/^https:\/\/chat\.googleapis\.com/)) {
    submitTriggers = ScriptApp.getProjectTriggers().filter(function(trigger) {
      return trigger.getEventType() === ScriptApp.EventType.ON_FORM_SUBMIT && trigger.getHandlerFunction() === 'postToRoom';
    });    
    if (submitTriggers.length < 1) {
      ScriptApp.newTrigger('postToRoom').forForm(FormApp.getActiveForm()).onFormSubmit().create();
    }
    PropertiesService.getScriptProperties().setProperty('WEBHOOK_URL', url);
    FormApp.getUi().alert('TSFormBot Configuration COMPLETE.\n\nClick "Ok" to continue.');
  } else {
    FormApp.getUi().alert('TSFormBot Configuration FAILED!.\n\nInvalid Chat Room Webhook URL.\n\nPlease enter a valid url.');
  }  
};


/*
 * Process Form Submission
 * 
 * @param {Object} e - form submit event object
 */
function postToRoom(e) {
  var options, options, url; 
  url = PropertiesService.getScriptProperties().getProperty('WEBHOOK_URL');
  if (url) {
    try { 
      payload = {
        "cards": [
          {
            "header": {
              "title": "TSFormBot",
              "subtitle": "Form Notifications Bot",
              "imageUrl": "https://raw.githubusercontent.com/techstreams/TSFormBot/master/notifications.png",
              "imageStyle": "IMAGE"
            },
            "sections": [
              {
                "widgets": [
                  {
                    "textParagraph": {
                      "text": '<b>' + FormApp.getActiveForm().getTitle() + '</b> has a <b><font color="#ff0000">new submission!</font></b>'
                    }
                  }
                ] 
              },
              {
                
                "widgets": [
                  {
                    "buttons": [
                      {
                        "textButton": {
                          "text": "GO TO RESPONSE",
                          "onClick": {
                            "openLink": {
                              "url": e.response.getEditResponseUrl()
                            }
                          }
                        }
                      },
                      {
                        "textButton": {
                          "text": "GO TO FORM",
                          "onClick": {
                            "openLink": {
                              "url": FormApp.getActiveForm().getEditUrl()
                            }
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            ] 
          } 
        ]
      }  
      options = {
        'method' : 'post',
        'contentType': 'application/json; charset=UTF-8',
        'payload' : JSON.stringify(payload)
      };
      UrlFetchApp.fetch(url, options); 
    } catch(err) {
      Logger.log('TSFormBot: Error processing Bot. ' + err.message);
    }
  } else {
    Logger.log('TSFormBot: No Webhook URL specified for Bot');
  }
}
