## TSFormBot

*If you enjoy my [Google Workspace Apps Script](https://developers.google.com/apps-script) work, please consider buying me a cup of coffee!* 


[![](https://techstreams.github.io/images/bmac.svg)](https://www.buymeacoffee.com/techstreams)

---

**TSFormBot** is an [Apps Script](https://www.google.com/script/start/) powered [Google Form](https://www.google.com/forms/about/) **Hangouts Chat Bot** which creates form submission webhook notifications for [Hangouts Chat Rooms](https://gsuite.google.com/products/chat/).

*:point_right: For an overview, see this [blog post](https://medium.com/@techstreams/its-time-to-chat-with-a-little-help-from-our-friends-caf99b9969f8).*

<br>

<table>
  <tr>
    <td>Use with <strong><a href="https://gsuite.google.com/solutions/">G Suite for Business</a></strong></td>
    <td>Use with <strong><a href="https://edu.google.com/">G Suite for Education</a></strong></td>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/techstreams/TSFormBot/master/img/tsformbot.jpg"></td>
    <td><img src="https://raw.githubusercontent.com/techstreams/TSFormBot/master/img/tsformbotedu.jpg"></td>
  </tr>
</table>


<br>

---

TSFormBot has been upgraded to include form responses.

| SUPPORTED | GOOGLE FORM ELEMENT |
| :-------: | :----------------- |
| :heavy_check_mark: | Short Answer |
| :heavy_check_mark: | Paragraph |
| :heavy_check_mark: | Multiple Choice |
| :heavy_check_mark: | Checkboxes |
| :heavy_check_mark: | Dropdown |
| :heavy_check_mark: | Linear Scale |
| :heavy_check_mark: | Multiple Choice Grid |
| :heavy_check_mark: | Checkbox Grid |
| :heavy_check_mark: | Date |
| :heavy_check_mark: | Date/Time |
| :heavy_check_mark: | Time |
| :heavy_check_mark: | Duration |
| :x: | File Upload |

<br>

**Important:**

*:point_right: Forms with the ['collect respondents' email addresses'](https://support.google.com/docs/answer/139706) option enabled will display the form submitter email in the bot notification.*

*:point_right: Form responses for elements containing images will only display associated text in the bot notification.*

<br>

**Looking for the previous version of TSFormBot?**  See [v1](https://github.com/techstreams/TSFormBot/tree/v1).


---

## Getting Started

### Installation

**New Install**

* Create a new [Google Form](form.new)
* From within the new form, select the **More _(three dots)_ > Script editor** menu 
* Delete the code in `Code.gs` from the script editor
* Click on the `Untitled project` project name, and rename to `TSFormBot`
* Copy and paste the [code](Code.gs) into the script editor
* Select the menu **File > Save all**
* Close the Script editor window
* Reload the Form

<br>

**Upgrade an Existing TSFormBot**

* Open existing TSFormBot enabled Google Form
* From within the form, select the **More _(three dots)_ > Script editor** menu 
* Delete the code in `Code.gs` from the script editor
* Copy and paste the [code](Code.gs) into the script editor
* Select the menu **File > Save all**
* Select the **Run > Enable new Apps Script runtime powered by V8** *(if V8 is not already enabled)*
* Select the **Edit > Current Project's Triggers**
* Delete any existing project `From form - On form submit` triggers *(click the __More > Delete trigger__ menu to the right of each trigger to delete)*
* Close the Project Triggers window
* Close the Script editor window
* Reload the Form

<br>


> *:grey_question: Prefer to install the __TSFormBot - Kitchen Sink Demo__?*
> * *Login to [Google Drive](https://drive.google.com/)*
> * *Access the __[TSFormBot - Kitchen Sink Demo](https://docs.google.com/forms/d/1274HULOEGv9xVAhAVlwqmmwxPwsV8S5rBqAVzBQEj7I/template/preview)__*
> * *Click the __Use Template__ button. This will copy the form to Google Drive.*

<br>


### Create Hangouts Chat Room Webhook

**Access the Hangouts Chat Room Webhooks**

* Go to [Hangouts Chat](https://chat.google.com)
* Select the desired **Hangouts Chat room** *(or create a new one)*
* Select the **dropdown** for the room
* Select **Configure webhooks**

![](img/step2.png)

<br>

**Add a Webhook**

* Select **+ ADD WEBHOOK**

![](img/step3.png)

<br>

**Enter a Webhook Name**

* Enter a **webhook name**
* *(Optional) Enter an Avatar URL*
* Click **Save**

![](img/step4.png)

**Important:**

*:point_right: Multiple TSFormBot enabled Google Forms can be used to provide notifications to a single [Google Hangouts Chat Room](https://gsuite.google.com/products/chat/).  Be sure to use descriptive webhook names to disguish multiple bots.*

<br>

**Make a Copy of the URL**

* Click the **Copy** button to make a copy of the webhook URL

![](img/step5.png)


<br>

### Configure TSFormBot

**Enable TSFormBot**

* Open the form and wait for the menu to fully load
* Select the **TSFormBot** menu
* Select the **Enable Bot** menu
* *Complete the Google authoriation prompts if enabling TSFormBot for the first time and then re-run the __Enable Bot__ menu.*

![](img/step6.png)

![](img/step7.png)

<br>

**Enter the Webhook URL**

* Enter the full **Webhook URL** copied in **Make a Copy of the URL** step above
* Click **Ok**
* Click **Ok** when configuration complete

![](img/step9-1.png)

![](img/step9-2.png)

<br>


### Submit to the Google Form

* Submit an entry to the form
* A new form submission notification post will be made to the Hangouts Chat room

**Important:**

*:point_right: If the notification timestamp does not accurately reflect the correct timezone, ensure the Apps Script timezone is configured appropriately. The Apps Script timezone can be changed by opening the Form’s Apps Script editor (__More menu _(three dots)_ > Script editor__) and altering the timezone under the Apps Script editor __File > Project properties__ menu.*


<br>


## Important Notes

* Multiple TSFormBot enabled Google Forms can be used to provide notifications to a single [Google Hangouts Chat Room](https://gsuite.google.com/products/chat/).

* Check the [Apps Script Dashboard](https://script.google.com) for execution errors if TSFormBot does not work as expected.

* TSFormBot may not be appropriate for all Google Forms.

---

## License

**TSFormBot License**

© Laura Taylor ([github.com/techstreams](https://github.com/techstreams)). Licensed under an MIT license.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
