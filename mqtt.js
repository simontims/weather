const clientId = "BrowserTest" + new Date().getTime();
const host = "postman.cloudmqtt.com";
const port = 14889;
// const topic = "weatherWindspeed";
// const topic2 = "weatherWinddirectionHeading";
const topicArray = ["bubble/weather/windspeed", "bubble/weather/windDirectionHeading", "bubble/weather/temperature", "bubble/weather/BMPressure", "bubble/weather/humidity", "bubble/weather/dewPoint", "bubble/weather/rssi"];
const client = new Paho.MQTT.Client(host, Number(port), clientId);

client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

var options = {
	onSuccess:onConnect,
  username: "read",
  password: "read",
	onFailure:doFail
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

  console.log("onMessageArrived: " +message.destinationName+ ": " +message.payloadString);

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
  
  
  //let el = document.createElement('div')
  //el.innerHTML = message.destinationName + ": " + message.payloadString
  //document.body.appendChild(el)
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