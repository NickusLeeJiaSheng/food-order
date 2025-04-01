const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');
const { db } = require('./firebase-node'); // Import Firebase configuration
const { doc, getDoc } = require('firebase/firestore');

// Path to your PDF file
const pdfPath = path.join(__dirname, 'invitation.pdf');

// GitHub repository details
const repoPath = '/Users/nickus/Desktop/Clara/food-order/';
const commitMessage = 'Add generated invitation PDF';
const branchName = 'main'; // Replace with your branch name if different

// Function to execute shell commands
function execShellCommand(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            console.log(`Command: ${cmd}`);
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            if (error) {
                reject(error);
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}

// Function to fetch data from Firebase
async function fetchData() {
    const userSelectionRef = doc(db, 'selectedDishes', 'userSelection');
    const userSelectionSnap = await getDoc(userSelectionRef);

    const dateRef = doc(db, 'dates', 'uniqueDocumentId');
    const dateSnap = await getDoc(dateRef);

    if (userSelectionSnap.exists() && dateSnap.exists()) {
        const dishesData = userSelectionSnap.data().dishes || [];
        const dishNames = dishesData.map(dishItem => `• ${dishItem.dish}`).join('\n                ');

        const dateData = dateSnap.data();
        const eventDate = dateData.date || "Date not available";
        const eventTime = dateData.time || "Time not available";

        return { dishNames, eventDate, eventTime };
    } else {
        throw new Error("No such document found!");
    }
}

// Function to generate PDF
async function generatePDF() {
    const name = "Clara Lim";
    const { dishNames, eventDate, eventTime } = await fetchData();

    const invitation = `
        Dear ${name},

        I would like to invite you to join me for a dinner/lunch.

        Date: ${eventDate}
        Time: ${eventTime}

        I will take care of the dishes:
        ${dishNames}
        
        We'll dine with delicious food and enchanting conversation.
        Your presence will make this evening complete.

        I can't wait to share this special day with you.

        With all my love,
        Nickus
    `;

    const pdfDoc = new jsPDF();
    pdfDoc.text(invitation, 10, 10);
    pdfDoc.save(pdfPath);
    console.log('PDF generated successfully');
}

// Function to upload PDF to GitHub
async function uploadPDFToGitHub() {
    try {
        // Generate the PDF
        await generatePDF();

        // Copy the PDF to the repository
        fs.copyFileSync(pdfPath, path.join(repoPath, 'invitation.pdf'));
        console.log('PDF copied to repository');

        // Change directory to the repository
        process.chdir(repoPath);
        console.log('Changed directory to repository');

        // Run Git commands
        await execShellCommand('git add invitation.pdf');
        await execShellCommand(`git commit -m "${commitMessage}"`);
        await execShellCommand(`git push origin ${branchName}`);

        console.log('PDF uploaded to GitHub successfully!');
    } catch (error) {
        console.error('Error uploading PDF to GitHub:', error);
    }
}

// Run the upload function
uploadPDFToGitHub();


