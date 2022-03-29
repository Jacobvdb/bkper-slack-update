function postToSlack() {
  var converted = getInfo("Converted");
  var countries = getInfo("Converted_Countries");

  if (converted.nr == true && countries.nr == true ) { 
    // trophy
    var text =  ":trophy: *" + converted.amount + "* Customers in *" + countries.amount +"* Countries  "
  } 
  if(converted.nr == true && countries.nr == false){
    var text =  " :first_place_medal: *" + converted.amount + "* Customers in " + countries.amount +" Countries  "
  } 
  if (converted.nr == false && countries.nr == true){
    var text =  " " + converted.amount + " Customers in :first_place_medal: *" + countries.amount +"* Countries  " 
  } 
  if (converted.nr == false && countries.nr == false){
    var text =  " " + converted.amount + " Customers in " + countries.amount +" Countries  "
  }
 // Logger.log(text)

  var payload = {
    "channel" : "#finances",
    "text" : text
  }
 
  var options = {
    "method" : "post",
    "contentType" : "application/json",
    "payload" : JSON.stringify(payload)
  };
  
  return UrlFetchApp.fetch(getScriptProperty("webHookUrl"), options)
}


function getInfo(accountName){

  var bookId = getScriptProperty("bookId")
  var book = BkperApp.getBook(bookId);

  var account = book.getAccount(accountName)
  var amount = account.getBalance().toNumber();
  var nr = records(accountName,amount)

  return {amount , nr}
}


function records(accountName, amount){
  var scriptProperties = PropertiesService.getScriptProperties();
  var standingMax = scriptProperties.getProperty(accountName);
  
  if (standingMax){
    var nr = false
      if( amount > standingMax){ 
        
        //Logger.log('New record amount is %s, the old amount was  %s! ', amount,standingMax)
        scriptProperties.setProperty(accountName, amount)
        return true 
      }
      else {
        return false
      }
  } else {

    scriptProperties.setProperty(accountName, amount)
    return true
  } 
  
}

function getScriptProperty(property){
  var scriptProperties = PropertiesService.getScriptProperties();
   return scriptProperties.getProperty(property)
}


//
// tests
//
function test_getInfo(){
  Logger.log(getInfo("Converted"));
  Logger.log(getInfo("Converted_Countries"));
  
}

function test_records(){
  Logger.log(records('Converted', 12034));
  Logger.log(records("Converted_Countries", 53));
}

function test_GetScriptProperties(){
   var scriptProperties = PropertiesService.getScriptProperties();
   Logger.log(scriptProperties.getProperty("bookId"))
   Logger.log(scriptProperties.getProperty("webHookUrl"))
}

//
// utils 
//
function check_ScriptProperties(){
  var scriptProperties = PropertiesService.getScriptProperties();
  var properties = scriptProperties.getProperties();

  for (var property in properties) {
    Logger.log('account %s ammount %s!', property, properties[property]);
  }
}

function set_scriptProperties(){
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty("Converted","12033");
  scriptProperties.setProperty("Converted_Countries","52");
  // once
  scriptProperties.setProperty("bookId","Your Bkper Book ID");
  // once
  scriptProperties.setProperty("webHookUrl","Your Slack webhook ");
}

function delete_scriptProperties(){
  var scriptProperties = PropertiesService.getScriptProperties();
  //scriptProperties.deleteProperty("webHookUrl")
  //scriptProperties.deleteProperty("bookId")
  //scriptProperties.deleteAllProperties();
}


