function haveHealthCondition(el) {
	var chkName = document.getElementsByName(el.name);
	var no_healthcondition = document.getElementById("no-healthcondition");

	no_healthcondition.checked = false;
	for (var i = 1; chkName.length; i++) {
		if (chkName[i].checked) {
			no_healthcondition.setAttribute("checked", false);
		}
	}
}

function noHealthCondition(el) {
	var chkName = document.getElementsByName(el.name);
	var no_healthcondition = document.getElementById("no-healthcondition");

	if (no_healthcondition.checked) {
		for (var i = 1; chkName.length; i++) {
			chkName[i].checked = false;
		}
	}
}



function haveSymptoms(el) {
	var chkName = document.getElementsByName(el.name);
	var nosymptom = document.getElementById("nosymptom");

	nosymptom.checked = false;
	for (var i = 1; chkName.length; i++) {
		if (chkName[i].checked) {
			nosymptom.setAttribute("checked", false);
		}
	}
}

function noSymptoms(el) {
	var chkName = document.getElementsByName(el.name);
	var nosymptom = document.getElementById("nosymptom");

	if (nosymptom.checked) {
		for (var i = 1; chkName.length; i++) {
			chkName[i].checked = false;
		}
	} 
}
