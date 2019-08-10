const clientId = "BrowserTest" + new Date().getTime();
const host = "postman.cloudmqtt.com";
const port = 34889;
UL_Max_Length = 8;

const topicArray = ["bubble/weather/windspeed", "bubble/weather/windDirectionHeading", "bubble/weather/temperature", "bubble/weather/BMPressure", "bubble/weather/humidity", "bubble/weather/dewPoint", "bubble/weather/rssi", "bubble/weather/status"];
const client = new Paho.MQTT.Client(host, Number(port), clientId);

client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

var options = {
	onSuccess: onConnect,
	userName: "read",
	password: "read",
	useSSL: true,
	onFailure: doFail
}

var subscribeOptions = {
	onSuccess:onSubscribeSuccess,
	onFailure:onSubscribeFail
}

client.connect(options);

function onConnect() {
  console.log("Connected using clientID " + clientId);
  topicArray.forEach(topic => {console.log("Subscribing to " + topic); client.subscribe(topic, subscribeOptions);});
}

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
  client.connect(options);
}

const publish = (dest, msg) => {
  console.log("Publishing " + msg + "to " + dest);
  let message = new Paho.MQTT.Message(msg);
  message.destinationName = dest;
  client.send(message);
}

function onMessageArrived(message) {

  console.log(message.destinationName+ ": " +message.payloadString);

  if (message.destinationName == "bubble/weather/windspeed"){
    document.getElementById("windspeed").setAttribute("data-value", Number(message.payloadString));  
  }

  if (message.destinationName == "bubble/weather/windDirectionHeading" && message.payloadString != "-1"){
    document.getElementById("winddirection").setAttribute("data-value", Number(message.payloadString));  
  }

  if (message.destinationName == "bubble/weather/temperature"){
    document.getElementById("temperature").setAttribute("data-value", Number(message.payloadString));  
  }  

  if (message.destinationName == "bubble/weather/BMPressure"){
    document.getElementById("bmpressure").setAttribute("data-value", Number(message.payloadString));  
  }   
  
  if (message.destinationName == "bubble/weather/humidity"){
	document.getElementById("humidity").setAttribute("data-value", Number(message.payloadString));  
  } 

  if (message.destinationName == "bubble/weather/dewPoint"){
	document.getElementById("dewpoint").setAttribute("data-value", Number(message.payloadString));  
  }   

  if (message.destinationName == "bubble/weather/rssi"){
	document.getElementById("rssi").setAttribute("data-value", Number(message.payloadString));  
  }    
	
  if (message.destinationName == "bubble/weather/status"){
	// document.getElementById("status").innerHTML = (message.payloadString);  
	let UL_Length = $("#statuslist li").length;
	if(UL_Length === UL_Max_Length){ 
        	$("#menustatus li").last().remove();
        }
	// $("#statuslist").prepend(`<li>New Item</li>`);
	$("#statuslist").prepend("<li>" + message.payloadString + "</li>");
	 
  }     
}

function doFail(e){
	console.log(e);
}

function onSubscribeSuccess(e)	{
	console.log("Subscribe successful");
	console.log(e);
}

function onSubscribeFail(e) {
	console.log("Subscribe failed");
	console.log(e);
}
