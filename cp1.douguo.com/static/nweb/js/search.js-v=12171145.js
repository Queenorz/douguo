// 搜索
toHex.hexchars = "0123456789ABCDEF";

function toHex(B) {
	return toHex.hexchars.charAt(B >> 4) + toHex.hexchars.charAt(B & 15)
}
utfurl.okURIchars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function Search() {
	var B = "/caipu";
	if ($("#global_search_inpt").val() == "" || $("#global_search_inpt").val() == "搜索菜谱、菜单、食材、用户") {
		$("#global_search_inpt").val("搜索菜谱、菜单、食材、用户");
		location.href = B;
		return false;
	} else {
		location.href = B+"/"+encodeURIComponent($("#global_search_inpt").val());
	}
	return false;
}
$("#global_search_inpt").keyup(function(event){
    if(event.keyCode ==13){
        Search();
    }
});
function Search2() {
	var B = $("#searchForm2").attr("action");
	if ($("#global_search_inpt2").val() == "" || $("#global_search_inpt2").val() == "搜索菜谱、菜单、食材、用户") {
		$("#global_search_inpt2").val("搜索菜谱、菜单、食材、用户");
		location.href = B + buildURL("");
		return false;
	} else {
		location.href = B + buildURL($("#global_search_inpt2").val());
	}
	return false;
}
function buildURL(B) {
	B = B.replace(/^\s+|\s+$/g, "");
	B = B.replace(/\"/g, "”");
	B = B.replace(/\*/g, "");
	if (B == "") {
		return ""
	}
	s = utfurl(B);
	s = s.replace(/%20/g, "+");
	return s.replace(/%(5E|2E|2D|2F|3B|3F|40|2C|26|3A|3D|2B|24)/g, "_$1")
}
function utfurl(H) {
	var H = toutf8(H);
	var F;
	var E = "";
	for (var G = 0; G < H.length; G++) {
		if (utfurl.okURIchars.indexOf(H.charAt(G)) == -1) {
			E += "%" + toHex(H.charCodeAt(G))
		} else {
			E += H.charAt(G)
		}
	}
	return E
}
function toutf8(H) {
	var G, J;
	var F = "";
	var I = 0;
	while (I < H.length) {
		G = H.charCodeAt(I++);
		if (G >= 56320 && G < 57344) {
			continue
		}
		if (G >= 55296 && G < 56320) {
			if (I >= H.length) {
				continue
			}
			J = H.charCodeAt(I++);
			if (J < 56320 || G >= 56832) {
				continue
			}
			G = ((G - 55296) << 10) + (J - 56320) + 65536
		}
		if (G < 128) {
			F += String.fromCharCode(G)
		} else {
			if (G < 2048) {
				F += String.fromCharCode(192 + (G >> 6), 128 + (G & 63))
			} else {
				if (G < 65536) {
					F += String.fromCharCode(224 + (G >> 12), 128 + (G >> 6 & 63), 128 + (G & 63))
				} else {
					F += String.fromCharCode(240 + (G >> 18), 128 + (G >> 12 & 63), 128 + (G >> 6 & 63), 128 + (G & 63))
				}
			}
		}
	}
	return F
}
// 搜索建议词
function selectItem(D) {
	searchContent = removeHTMLTag($("#global_search_inpt").val());
	if (searchContent.length == 0) {
		$.ajax({
			url: '/search/ajaxSuggestCook',
			type:'get',
			success: function(A){
				var B = '<ul id="ulItems">';
				for (i = 0; i < 10; i++) {
					modnm = i + 1;
					B += '<li id="li_' + i + '" class="trackClick" module="42" href="' + A.data[i] + "\" onclick=searchJump('recipe','" + A.data[i] + "')><i>" + modnm + '.</i> <span id="si_' + i + '" class="op">' + A.data[i] + "</span></li>"
				}
				B += "</ul>";
				$(".sugg2").html(B).show();
			}
		});
	}
	var C = $("#ulItems li").length;
	if (D.keyCode == 38 || D.keyCode == 40) {
		if (C > 0) {
			oldSelIndex = currentSelIndex;
			if (D.keyCode == 38) {
				if (currentSelIndex == -1) {
					currentSelIndex = C - 1
				} else {
					currentSelIndex = currentSelIndex - 1;
					if (currentSelIndex < 0) {
						currentSelIndex = C - 1
					}
				}
				if (currentSelIndex != -1) {
					document.getElementById("li_" + currentSelIndex).style.backgroundColor = "#eaeaea";
					document.getElementById("global_search_inpt").value = document.getElementById("si_" + currentSelIndex).innerText
				}
				if (oldSelIndex != -1) {
					document.getElementById("li_" + oldSelIndex).style.backgroundColor = "#f4f4f4"
				}
			}
			if (D.keyCode == 40) {
				if (currentSelIndex == C - 1) {
					currentSelIndex = 0
				} else {
					currentSelIndex = currentSelIndex + 1;
					if (currentSelIndex > C - 1) {
						currentSelIndex = 0
					}
				}
				if (currentSelIndex != -1) {
					document.getElementById("li_" + currentSelIndex).style.backgroundColor = "#eaeaea";
					document.getElementById("global_search_inpt").value = document.getElementById("si_" + currentSelIndex).innerText
				}
				if (oldSelIndex != -1) {
					document.getElementById("li_" + oldSelIndex).style.backgroundColor = "#f4f4f4"
				}
			}
		}
	} else {
		if (D.keyCode == 13) {
			if (document.getElementById("ulItems").style.display != "none" && C > 0 && currentSelIndex != -1) {
				document.getElementById("global_search_inpt").value = document.getElementById("si_" + currentSelIndex).innerText;
				document.getElementById("ulItems").style.display = "none";
				currentSelIndex = -1;
				oldSelIndex = -1
			}
		}
	}
}

function searchJump(C, D) {
	$("#global_search_inpt").val(D);
	if (C == 'recipe')
	{
		url = "/caipu/" + D;
	}else{
		url = "/search/" + C + "/" + D;
	}
	window.location.href = url;
}

function removeHTMLTag(B) {
	B = B.replace(/\"/g, "”");
	B = B.replace(/<\/?[^>]*>/g, "");
	B = B.replace(/<!*/g, "");
	B = B.replace(/\/>*/g, "");
	B = B.replace(/[ | ]*\n/g, "\n");
	B = B.replace(/"|'|-|<|>*/g, "");
	B = B.replace(/ /ig, "");
	return B
}