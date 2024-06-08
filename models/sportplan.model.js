const { firestore } = require('../config/firebaseAdmin');
const admin = require('firebase-admin');

class SportPlanModel {
  constructor() {
    this.collection = firestore.collection('sport_plans');
  }
  async getSportPlanById(planId) {
  const doc = await this.collection.doc(planId).get();
  if (!doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() };
}

  async createSportPlan(data) {
    const docRef = await this.collection.add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
  }

  async updateSportPlanById(planId, data) {
    await this.collection.doc(planId).update({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await this.collection.doc(planId).get();
    return { id: planId, ...doc.data() };
  }
  
  async deleteSportPlanById(planId) {
    await this.collection.doc(planId).delete();
  }

  async listsport_plans() {
    const snapshot = await this.collection.get();
    const sport_plans = [];
    snapshot.forEach(doc => {
      sport_plans.push({ id: doc.id, ...doc.data() });
    });
    return sport_plans;
  }

  async getSportPlanRecommendations(preferences) {
    console.log('Preferences:', preferences);
    const recommendedTypes = ['running_beginner', 'badminton_beginner'];
    const snapshot = await this.collection
      .where('sportType', 'in', recommendedTypes)
      .where('difficultyLevel', '==', preferences.difficultyLevel)
      .get();
    const sport_plans = [];
    snapshot.forEach(doc => {
      sport_plans.push({ id: doc.id, ...doc.data() });
    });
    console.log('Recommended Sport Plans:', sport_plans);
    return sport_plans;
  }
}

module.exports = new SportPlanModel();
