var BookId = "agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIjZ5KIKDA";
var webhookUrl = "https://hooks.slack.com/services/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";

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
 
  return UrlFetchApp.fetch(webhookUrl, options)
}


function getInfo(accountName){
  var book = BkperApp.getBook(BookId);

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

//
// tests
//
function test_getInfo(){
  Logger.log(getInfo("Converted"));
  Logger.log(getInfo("Converted_Countries"));
}

function test_records(){
  Logger.log(records('Converted', 282));
  Logger.log(records("Converted_Countries", 47));
}

//
// utils 
//
function check_records(){
  var scriptProperties = PropertiesService.getScriptProperties();
  var properties = scriptProperties.getProperties();
  //for (var i = 0; i < keys.length; i++) {
  //   Logger.log(keys[i]);
  //}
  for (var property in properties) {
    Logger.log('account %s ammount %s!', property, properties[property]);
  }
}

function set_records(){
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty("Converted","281");
  scriptProperties.setProperty("Converted_Countries","46");
}

function delete_records(){
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.deleteAllProperties();
}



