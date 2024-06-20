const { firestore } = require('../config/firebaseAdmin');

class SportPlanModel {
  static async getSportPlanRecommendations(sport) {
    try {
      const sportPlansRef = firestore.collection('sportPlans').where('sportType', '==', sport);
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

  static async setFinishedSportPlan(userId, planId, isCompleted) {
    try {
      const userRef = firestore.collection('users').doc(userId);
      const userDoc = await userRef.get();
      const plans = userDoc.get('sportPlan.plans');

      const updatedPlans = plans.map(plan => {
        if (plan.id === planId) {
          return { ...plan, isCompleted: isCompleted };
        }
        return plan;
      });

      await userRef.update({
        'sportPlan.plans': updatedPlans
      });

      return updatedPlans;
    } catch (error) {
      throw new Error(`Error setting sport plan completion status: ${error.message}`);
    }
  }

  static async updateElapsedTime(userId, planId, elapsedTime) {
    try {
      const userRef = firestore.collection('users').doc(userId);
      const userDoc = await userRef.get();
      const plans = userDoc.get('sportPlan.plans');

      const updatedPlans = plans.map(plan => {
        if (plan.id === planId) {
          return { ...plan, elapsedTime: elapsedTime };
        }
        return plan;
      });

      await userRef.update({
        'sportPlan.plans': updatedPlans
      });
    } catch (error) {
      throw new Error(`Error updating elapsed time: ${error.message}`);
    }
  }
}

module.exports = SportPlanModel;
