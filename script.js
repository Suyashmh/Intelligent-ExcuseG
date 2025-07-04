document.addEventListener('DOMContentLoaded', () => {
    const situationselect = document.getElementById("Situation");
    const customInput = document.getElementById("customsituation");
    const generateBtn = document.getElementById("generate");
    const copyBtn = document.getElementById("copy");
    const output = document.getElementById("excuse");

    const GROQ_API_KEY = "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";
    const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
   
    //Toggle custom input
    situationselect.addEventListener("click", () => {
        customInput.hidden = situationselect.value !== "custom";
    });

    //Generate excuse
    generateBtn.addEventListener("click", async () => {
        let situation = situationselect.value;
        const style = document.getElementById("style").value;

        if (situation === "custom") {
            situation = customInput.value.trim();
            if (!situation) {
                output.textContent = "Please enter a custom situation.";
                return;
            }
        }

        output.textContent = "Generating excuse...";

        try {
            const prompt = `Generate a ${style} excuse for the following situation: "${situation}"`;

            const response = await fetch(GROQ_API_URL, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.9,
                })
            });

            const data = await response.json();
            const excuse = data.choices?.[0]?.message.content || "Could not generate an excuse.";
            output.innerText = excuse;
        } catch (err) {
            console.error(err);
            output.innerText = "Error generating excuse. Please try again later.";
        }
    });

    //Copy Excuse
    copyBtn.addEventListener("click", () => {
        const text = output.innerText;
        if (!text || text.startsWith("Generating excuse") || text.startsWith("Error generating excuse")) return;

        navigator.clipboard.writeText(text).then(() => {
            copyBtn.innerText = "Copied!";
            setTimeout(() => (copyBtn.innerText = "Copy Excuse"), 1500);
        });
    });
});
// Add event listener for Enter key to trigger generation
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const generateBtn = document.getElementById("generate");
        if (document.activeElement !== generateBtn) {
            event.preventDefault(); // Prevent form submission if inside a form
            generateBtn.click();
        }
    }
});


