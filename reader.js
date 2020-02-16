import { $, render } from "./z.js";

const samples = [
    [1,2,3,[1,2,3],[2,3,"hello"]],
    [[true,false,true,false],[true,false,true,false]]
];

const processJSON = (data) => {

    if(typeof data == "number") return ["div.json-val-number", data];

    if(typeof data == "string") return ["div.json-val-string", data];

    if(typeof data == "boolean") return ["div.json-val-boolean-" + (data ? "true" : "false"), data + ""];

    if(data instanceof Array) {

	return ["div.json-val-array", ...data.map(d => processJSON(d))];
	
    }

    if(data === null) return ["div.json-val-null", "∅"];

    if(typeof data == "object") {

	return ["div.json-val-object", ...Object.entries(data).map(([k,v]) => {

	    return ["details.json-val-object-kv", {open: true},
		    ["summary.json-val-object-key", k],
		    ["div.json-val-object-val", processJSON(v)]];
	    
	})];

    };

    return "";




};

const generatePreview = (zaharDatastructure) => {

    render("#preview", zaharDatastructure);
    
}

let JSONVal = () => {

    let val = document.querySelector("#reader textarea").value;

    try {
	
	info.className = "";

	info.textContent = "Enter your JSON Data:";

	let data = JSON.parse(val);

	generatePreview(processJSON(data));

    } catch (err) {

	let info = document.querySelector("#info");

	info.className += "warning";

	info.textContent = err.toString();
	
    }

}

const drawUI = async () => {

    const input = `{"supermarket": "Nisarga",
 "items": [{"title": "Ellunda",
	 "count": 30},
	 {"title": "Kappalandi Mittayi",
	 "count": 40}]}`;
    
    await render("#app", ["div#reader-and-preview",
			  ["div#reader",
			   ["p#info", "Enter your JSON data:"],
			   ["textarea", {autocomplete: "off", value: input}, input]],
			  ["div#preview"]])

    $("#reader").addEventListener("input", () => {
	
	JSONVal();

    })

}

window.addEventListener("load", async () => {

    await drawUI();
    JSONVal();

});


