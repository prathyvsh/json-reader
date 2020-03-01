import { $, $all, render } from "./z.js";

const samples = [
    [1,2,3,[1,2,3],[2,3,"hello"]],
    [[true,false,true,false],[true,false,true,false]]
];

const processJSON = (data, ctx) => {

    if(typeof data == "number") return ["div.json-val-number", data];

    if(typeof data == "string") return ["div.json-val-string", data];

    if(typeof data == "boolean") return ["div.json-val-boolean-" + (data ? "true" : "false"), data + ""];

    if(data instanceof Array) {

	return ["div.json-val-array", ...data.map((d, i) => {
	    
	    let newCtx = ctx.concat(i);

	    return processJSON(d, newCtx);

	})];
	
    }

    if(data === null) return ["div.json-val-null", "∅"];

    if(typeof data == "object") {

	return ["div.json-val-object", ...Object.entries(data).map(([k,v]) => {

	    let newCtx = ctx.concat(k);

	    return ["details.json-val-object-kv", {open: true},
		    ["summary.json-val-object-key", k, ["a.explore", {href: "/?data=" + encodeURIComponent(JSON.stringify(data)) + "&path=" + encodeURIComponent(newCtx.join("."))}, "→"]],
		    ["div.json-val-object-val", processJSON(v, newCtx)]];
	    
	})];

    };

    return "";

};

const generatePreview = (zaharDatastructure) => {

    render("#preview", zaharDatastructure);
    
};

const setURLData = (data) => {

    let path = new URLSearchParams(window.location.search).get("path") || "/";

    window.history.pushState({},"", "./?data=" + encodeURIComponent(JSON.stringify(data)) + "&path=" + path);

}

let JSONVal = () => {

    let val = document.querySelector("#reader textarea").value;

    try {
	
	info.className = "";

	info.textContent = "Edit JSON Data:";

	let data = JSON.parse(val);

	setURLData(data);

	generatePreview(processJSON(data, []));

    } catch (err) {

	let info = document.querySelector("#info");

	info.className += "warning";

	info.textContent = err.toString();
	
    }

};

const drawUI = async (data, path) => {

    console.log(data);

    const selectPath = (data, path) => (path || "").split(".").reduce((i,n) => i[n], data) || data;

    const selectedInput = selectPath(data, path);

    const pathSegs = (path || "").split(".").reduce((i, n) => {

	let lastEl = i[i.length - 1];
	
	let newArr = i.concat(lastEl ? [[n, lastEl + "." + n]] : [[n,n]]);

	return newArr;

    }, []);


    const pathItems = pathSegs.map(([key, val]) => ["li", key]);


    await render("#app", ["div#reader-and-preview",
			  ["div#reader",
			   // ["nav#panels",
			    // ["ul", ["li", "Data"], ["li", "Scheme"]]],
			   ["p#info", "Enter your JSON data:"],
			   ["textarea", JSON.stringify(selectedInput)]],
			  ["div#preview-with-nav",
			   ["nav#data-navigation", ["ul", ["li", "/"], ...pathItems]],
			   ["div#preview"]]]);

    $("#reader").addEventListener("input", () => {
	
	JSONVal();

    });

    [...$all(".explore")].map(node => node.addEventListener("click", (evt) => {

	console.log("Open" + evt.target.href);
	
    }));

}

window.addEventListener("load", async () => {

    let data = new URLSearchParams(window.location.search).get("data");
    let JSONData = JSON.parse(decodeURIComponent(data));
    let path = new URLSearchParams(window.location.search).get("path");
    await drawUI(JSONData, path);
    JSONVal();

});


