// Import Firestore modules instead of Realtime Database
import { db, app } from './firebase.js'
import { collection, setDoc, doc, getDocs } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';
"https://cdn.jsdelivr.net/npm/vue@3.2.31/dist/vue.global.js"
"https://unpkg.com/axios/dist/axios.min.js"


// Vue application
const { createApp } = Vue;

createApp({
    data() {
        return {
            dishes: { italian: [] },
            selected: []
        };
    },
    methods: {
        async addToSelection(dish) {
            // Prevent duplicate selections
            if (!this.selected.some(selectedDish => selectedDish.dish === dish.dish)) {
                this.selected.push(dish);

                try {
                    // Update Firestore with the entire selected list
                    await setDoc(doc(db, 'selectedDishes', 'userSelection'), { dishes: this.selected });
                    console.log("Selected dishes updated in Firestore");

                    // Show alert
                    this.showAlert(`${dish.dish} is added`);
                } catch (e) {
                    console.error("Error updating selected dishes: ", e);
                }
            }
        },
        showAlert(message) {
            const alertDiv = document.getElementById('alert');
            alertDiv.textContent = message;
            alertDiv.className = 'alert-fixed';
            
            setTimeout(() => {
                alertDiv.textContent = '';
                alertDiv.className = '';
            }, 2000);
        },
        async deleteItem(dish) {
            // Find the index of the dish in the selected array
            const index = this.selected.findIndex(selectedDish => selectedDish.dish === dish.dish);
            
            if (index !== -1) {
                // Remove the dish from the array
                this.selected.splice(index, 1);
    
                try {
                    // Update Firestore with the new selected list
                    await setDoc(doc(db, 'selectedDishes', 'userSelection'), { dishes: this.selected });
                    console.log("Selected dishes updated in Firestore");
    
                    // Show alert
                    this.showAlert(`${dish.dish} is removed`);
                } catch (e) {
                    console.error("Error updating selected dishes: ", e);
                }
            } else {
                console.log("Dish not found in the selection");
            }
        }
    },
    async mounted() {
        // Load dishes from JSON via Axios
        try {
            const response = await axios.get("dishes.json");
            this.dishes = response.data;
        } catch (error) {
            console.error("Error loading dishes:", error);
        }

        // Load selected dishes from Firestore
        try {
            const querySnapshot = await getDocs(collection(db, 'selectedDishes'));
            querySnapshot.forEach((doc) => {
                this.selected = doc.data().dishes;
            });
        } catch (e) {
            console.error("Error loading selected dishes from Firestore: ", e);
        }
    }
}).mount('#app');

