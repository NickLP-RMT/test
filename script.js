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

    fetch("https://script.google.com/macros/s/AKfycbzStkRfTuKuU8b7ZWmyCXp8KzDfh-77oG5s9lW23lbjI_3uCLAZfklJ0RidSScp99Fi/exec", {
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
