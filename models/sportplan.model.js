const { firestore } = require('../config/firebaseAdmin');

class SportPlanModel {
  static async getSportPlanRecommendations(sport) {
    try {
      const sportPlansRef = firestore.collection('sportPlans').where('sport', '==', sport);
      const snapshot = await sportPlansRef.get();
      
      if (snapshot.empty) {
        return [];
      }

      const sportPlans = [];
      snapshot.forEach(doc => {
        sportPlans.push({ id: doc.id, ...doc.data() });
      });

      return sportPlans;
    } catch (error) {
      throw new Error(`Error getting sport plan recommendations: ${error.message}`);
    }
  }
}

module.exports = SportPlanModel;
