function submitData() {
    // Show loading overlay
    document.getElementById("loadingOverlay").classList.add("active");

    var formData = new FormData(document.getElementById("dataForm"));
    var timeFrom = "'" + formData.get("timeFromHour") + ":" + formData.get("timeFromMinute"); // Add apostrophe
    var timeTo = "'" + formData.get("timeToHour") + ":" + formData.get("timeToMinute"); // Add apostrophe

    formData.set("columnA", new Date().toISOString()); // Adding timestamp
    formData.set("date", formData.get("date").split("-").reverse().join("/")); // Formatting date to dd/mm/yyyy
    formData.set("columnE", timeFrom);
    formData.set("columnF", timeTo);

    fetch("https://script.google.com/macros/s/AKfycbzBxI35vuhxlTWqO6fsI-aKKMb_7SFG3E3THxjKxdGaon3fJg73ZV443aHt3Fe17blK/exec", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Hide loading overlay
        document.getElementById("loadingOverlay").classList.remove("active");

        if (data.success) {
            alert("ข้อมูลถูกบันทึกเรียบร้อยแล้ว!");
            document.getElementById("dataForm").reset();
            document.getElementById("message").innerHTML = "";
        } else {
            document.getElementById("message").innerHTML = data.message; // แสดงข้อความที่ได้จากการตรวจสอบข้อมูลใน Google Sheets
        }
    })
    .catch(error => {
        // Hide loading overlay
        document.getElementById("loadingOverlay").classList.remove("active");

        console.error("เกิดข้อผิดพลาด:", error);
    });
}
function searchData() {
    var formData = new FormData(document.getElementById("searchForm"));
    var translatorName = formData.get("translatorName");
    var date = formData.get("date");

    fetch("https://script.google.com/macros/s/AKfycbzBxI35vuhxlTWqO6fsI-aKKMb_7SFG3E3THxjKxdGaon3fJg73ZV443aHt3Fe17blK/exec" + translatorName + "&date=" + date)
        .then(response => response.json())
        .then(data => {
            var tbody = document.querySelector("#resultsTable tbody");
            tbody.innerHTML = "";

            data.records.forEach(record => {
                var row = document.createElement("tr");

                var bookingByCell = document.createElement("td");
                bookingByCell.textContent = record.bookingBy;
                row.appendChild(bookingByCell);

                var translatorForWorkCell = document.createElement("td");
                translatorForWorkCell.textContent = record.translatorForWork;
                row.appendChild(translatorForWorkCell);

                var translatorNameCell = document.createElement("td");
                translatorNameCell.textContent = record.translatorName;
                row.appendChild(translatorNameCell);

                var dateCell = document.createElement("td");
                dateCell.textContent = record.date;
                row.appendChild(dateCell);

                var timeFromCell = document.createElement("td");
                timeFromCell.textContent = record.timeFrom;
                row.appendChild(timeFromCell);

                var timeToCell = document.createElement("td");
                timeToCell.textContent = record.timeTo;
                row.appendChild(timeToCell);

                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error:", error);
        });
}
function showPage(page) {
    var bookingPage = document.getElementById('booking');
    var searchingPage = document.getElementById('searching');
    
    if (page === 'booking') {
        bookingPage.classList.add('active');
        searchingPage.classList.remove('active');
    } else if (page === 'searching') {
        bookingPage.classList.remove('active');
        searchingPage.classList.add('active');
    }
}
