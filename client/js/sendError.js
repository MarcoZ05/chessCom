const errorContainer = document.getElementById("errorContainer")

function sendError(errorMessage) {
    const errorChild = document.createElement("div")
    errorChild.className = "error"
    errorChild.innerHTML = errorMessage
    errorContainer.appendChild(errorChild)
    setTimeout(() => {
        errorContainer.removeChild(errorChild)
    }, 3000)
}

export default sendError