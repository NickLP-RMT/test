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

    // Check if the booking already exists
    fetch("https://script.google.com/macros/s/AKfycbyrGwQ-0iTZT8uRWZvBRTXlfQvnm6qYiThs1JWsG3p7reiYIFReozva55W5QQsFoQeB/exec")
        .then(response => response.json())
        .then(data => {
            // Hide loading overlay
            document.getElementById("loadingOverlay").classList.remove("active");

            // Check if any booking matches the current form data
            var isDuplicate = data.some(item => {
                return item.date === formData.get("date") &&
                       item.timeFrom === timeFrom &&
                       item.timeTo === timeTo;
            });

            if (isDuplicate) {
                document.getElementById("message").innerHTML = "เวลาที่เลือกมีการจองแล้ว กรุณาเลือกเวลาอื่น";
            } else {
                // Proceed to submit if no duplicates found
                submitToGoogleSheets(formData);
            }
        })
        .catch(error => {
            // Hide loading overlay
            document.getElementById("loadingOverlay").classList.remove("active");

            console.error("เกิดข้อผิดพลาดในการตรวจสอบการจองซ้ำ:", error);
        });
}

function submitToGoogleSheets(formData) {
    // Show loading overlay
    document.getElementById("loadingOverlay").classList.add("active");

    fetch("https://script.google.com/macros/s/AKfycbyrGwQ-0iTZT8uRWZvBRTXlfQvnm6qYiThs1JWsG3p7reiYIFReozva55W5QQsFoQeB/exec", {
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

        console.error("เกิดข้อผิดพลาดในการส่งข้อมูลไปยัง Google Sheets:", error);
    });
}
