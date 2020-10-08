export interface UserInterface {
    UUID: string;
    name: string;
    therapist_msg: firebase.firestore.Timestamp;
    user_msg: firebase.firestore.Timestamp;
}
