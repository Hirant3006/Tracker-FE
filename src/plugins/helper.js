import * as momentTimezone from 'moment-timezone'

const helper = {
    createId(){
        var text = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (text()+text()+""+text()+""+text()+""+text()+""+text()+text()+text());
	},
	isUrl(str) {
		var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
			'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
		return !!pattern.test(str);
	},
	isNumeric(value) {
        return /^-{0,1}\d+$/.test(value)
	},
	toFixedNumberic(number, fixed){
		let regex = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?")
		let numberFixed = number.toString().match(regex)[0]
		let result = new Intl.NumberFormat(undefined, { maximumSignificantDigits: 20 }).format(numberFixed)
		return result
	},
	isObjectEmpty(obj) {
		for(var key in obj) {
			if(obj.hasOwnProperty(key))
				return false;
		}
		return true;
	},
	isDate(date){
		return date instanceof Date && !isNaN(date.valueOf())
	},
	loadingImage(url){
		return new Promise(function(resolve, reject) {
			var img = new Image(); 
			img.src = url;
			img.onload = function() {
				resolve({
					width : this.width,
					height : this.height
				})
			}
		});
	},
	showFormData(formData){
		for (var pair of formData.entries()) {
			console.log(pair[0]+ ' :  ' + pair[1]); 
		}
	},
	pasteHtmlAtCaret(html, selectPastedContent) {
		var sel, range;
		if (window.getSelection) {
			sel = window.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				range = sel.getRangeAt(0);
				range.deleteContents();
	
				var el = document.createElement("div");
				el.innerHTML = html;
				var frag = document.createDocumentFragment(), node, lastNode;
				while ( (node = el.firstChild) ) {
					lastNode = frag.appendChild(node);
				}
				var firstNode = frag.firstChild;
				range.insertNode(frag);
				
				if (lastNode) {
					range = range.cloneRange();
					range.setStartAfter(lastNode);
					if (selectPastedContent) {
						range.setStartBefore(firstNode);
					} else {
						range.collapse(true);
					}
					sel.removeAllRanges();
					sel.addRange(range);
				}
			}
		} else if ( (sel = document.selection) && sel.type != "Control") {
			var originalRange = sel.createRange();
			originalRange.collapse(true);
			sel.createRange().pasteHTML(html);
			var range = sel.createRange();
			range.setEndPoint("StartToStart", originalRange);
			range.select();
		}
	},
	bytesToMegaBytes(bytes) {
		return Number(bytes / (1024*1024)).toFixed(2);
	},
	getListTimezone(){
		const arr = [];
        const names = momentTimezone.tz.names();
        for (const name of names) {
            if ((name.indexOf('/') < 0 && name !== 'UTC') || name.startsWith('Etc/')) {
                continue;
            }
            const data = {}
            data['tzName'] = name;
            data['tzPresentationName'] = momentTimezone.tz(name).format('Z');
            arr.push(data);
        }
        arr.sort((a, b) => {
            if (a.tzPresentationName === b.tzPresentationName) {
                if (a.tzName === 'UTC') {
                    return -1;
                }
                return a.tzName === b.tzName ? 0 : (a.tzName > b.tzName ? 1 : -1);
            }
            const afc = a.tzPresentationName.charAt(0);
            const bfc = b.tzPresentationName.charAt(0);
            if (afc === '-') {
                if (bfc === '+') {
                    return -1;
                }
                return a.tzPresentationName > b.tzPresentationName ? -1 : 1;
            }
            if (bfc === '-') {
                return 1;
            }
            return a.tzPresentationName > b.tzPresentationName ? 1 : -1;
        });
        arr.forEach(a => a.tzPresentationName = `(GMT ${a.tzPresentationName}) ${a.tzName}`);
        return arr;
	}
}
export default helper