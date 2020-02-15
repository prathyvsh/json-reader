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

    if(typeof data == "object") {

	return ["div.json-val-object", ...Object.entries(data).map(([k,v]) => {

	    return ["div.json-val-object-kv",
		    ["div.json-val-object-key", k],
		    ["div.json-val-object-val", processJSON(v)]];
	    
	})];

    };

    return "";




};

const generatePreview = (zaharDatastructure) => {

    render("#preview", zaharDatastructure);
    
}

let JSONVal = () => {

    warning.style.opacity = 0;
    let val = document.querySelector("#reader textarea").value;

    try {
	
	let data = JSON.parse(val);

	generatePreview(processJSON(data));

    } catch (err) {

	let warning = document.querySelector("#warning");
	warning.style.opacity = 1;
	warning.textContent = err.toString();
	
    }

}

const drawUI = async () => {
    
    await render("#app", ["div#reader-and-preview",
			  ["div#reader",
			   ["textarea", `{"marketplace": "Nisarga",
 "items": [{"title": "Ellunda",
	 "count": 30},
	 {"title": "Kappalandi Mittayi",
	 "count": 40}]}`],
			   ["div#warning"]
			  ],
			  ["div#preview"]])

    JSONVal();

    $("#reader").addEventListener("input", () => {
	
	JSONVal();

    })

}


drawUI();
