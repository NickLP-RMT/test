function submitData() {
    document.getElementById("loadingOverlay").style.display = 'flex';

    var formData = new FormData(document.getElementById("dataForm"));
    var timeFrom = formData.get("timeFromHour") + ":" + formData.get("timeFromMinute");
    var timeTo = formData.get("timeToHour") + ":" + formData.get("timeToMinute");

    formData.set("columnA", new Date().toISOString());
    formData.set("date", formData.get("date").split("-").reverse().join("/"));
    formData.set("columnE", timeFrom);
    formData.set("columnF", timeTo);

    fetch("https://script.google.com/macros/s/AKfycbzBxI35vuhxlTWqO6fsI-aKKMb_7SFG3E3THxjKxdGaon3fJg73ZV443aHt3Fe17blK/exec", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("loadingOverlay").style.display = 'none';

        if (data.success) {
            alert("ข้อมูลถูกบันทึกเรียบร้อยแล้ว!");
            document.getElementById("dataForm").reset();
            document.getElementById("message").style.display = 'none';
        } else {
            document.getElementById("message").textContent = data.message;
            document.getElementById("message").style.display = 'block';
        }
    })
    .catch(error => {
        document.getElementById("loadingOverlay").style.display = 'none';
        console.error("เกิดข้อผิดพลาด:", error);
    });
}

function searchData() {
    var formData = new FormData(document.getElementById("searchForm"));
    var translatorName = formData.get("translatorName");
    var date = formData.get("date");

    fetch(`https://script.google.com/macros/s/AKfycbzBxI35vuhxlTWqO6fsI-aKKMb_7SFG3E3THxjKxdGaon3fJg73ZV443aHt3Fe17blK/exec?translatorName=${translatorName}&date=${date}`)
        .then(response => response.json())
        .then(data => {
            var tbody = document.querySelector("#resultsTable tbody");
            tbody.innerHTML = "";

            if (data.records && data.records.length > 0) {
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
            } else {
                var row = document.createElement("tr");
                var noDataCell = document.createElement("td");
                noDataCell.setAttribute("colspan", "6");
                noDataCell.textContent = "No records found.";
                row.appendChild(noDataCell);
                tbody.appendChild(row);
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
}
