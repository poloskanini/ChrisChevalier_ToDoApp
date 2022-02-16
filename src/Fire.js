import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyBA08FA7xKUSjHEQxS9KXA4k33ajvG1hO0",
    authDomain: "todo-fb0fd.firebaseapp.com",
    projectId: "todo-fb0fd",
    storageBucket: "todo-fb0fd.appspot.com",
    messagingSenderId: "467443353077",
    appId: "1:467443353077:web:8c089ba4aeb575a2094cbc"
};

export default class Fire {
    constructor(callback) {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                callback(null);
            } else {
                firebase.auth().signInAnonymously().catch(error => {
                    callback(error);
                });
            }
        })
    }

    get ref() {
        return firebase.firestore().collection("lists");
    }

    getLists(callback) {
        let ref = this.ref.orderBy("name");
        this.unsubscribe = ref.onSnapshot(snapshot => {
            let lists = [];
            snapshot.forEach(doc => {
                lists.push({ id: doc.id, ...doc.data() })
            });
            callback(lists);
        }, function(error) {
            callback(error);
        });
    }

    addList(list) {
        this.ref.add(list);
    }

    deleteList(list) {
        this.ref.doc(list.id).delete();
    }

    updateList(list) {
        this.ref.doc(list.id).update(list);
    }

    detach() {
        this.unsubscribe();
    }
}