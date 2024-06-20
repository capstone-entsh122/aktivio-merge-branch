

const hitungBMR = (gender, weight, height, age) => {
    if (gender.toLowerCase() === 'male') {
      const bmr = 66.5 + (13.75 * weight) + (5.003 * height) - (6.75 * age);
      return bmr;
    } else if (gender.toLowerCase() === 'female') {
      const bmr = 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age);
      return bmr;
    } else {
      throw new Error("Jenis kelamin harus 'Male' atau 'Female'");
    }
  };

  const hitungKaloriHarian = (bmr, levelAktivitas) => {
    const tingkatAktivitas = {
      Unfit: 1.2,
      Average: 1.375,
      Good: 1.55,
    };
  
    if (!(levelAktivitas in tingkatAktivitas)) {
      throw new Error("Tingkat aktivitas tidak valid. Pilih dari 'Unfit', 'Average', 'Good'");
    }
  
    const kaloriHarian = bmr * tingkatAktivitas[levelAktivitas];
    return kaloriHarian;
  };

  const hitungRekomendasiNutrisi = (kaloriHarian) => {
    const proteinMin = 0.10 * kaloriHarian / 4;
    const proteinMax = 0.30 * kaloriHarian / 4;
  
    // 1 gram lemak = 9 kalori
    const lemakMin = 0.20 * kaloriHarian / 9;
    const lemakMax = 0.35 * kaloriHarian / 9;
  
    const karbohidratMin = 0.45 * kaloriHarian / 4;
    const karbohidratMax = 0.65 * kaloriHarian / 4;
  
    const air = kaloriHarian;
  
    return [proteinMin, proteinMax, lemakMin, lemakMax, karbohidratMin, karbohidratMax, air];
  };

  const hitungSemuaNutrisi = (gender, weight, height, age, levelAktivitas) => {
    // Hitung BMR
    const bmr = hitungBMR(gender, weight, height, age);
  
    // Hitung kalori harian
    const kaloriHarian = hitungKaloriHarian(bmr, levelAktivitas);
  
    // Hitung rekomendasi nutrisi
    const [proteinMin, proteinMax, lemakMin, lemakMax, karbohidratMin, karbohidratMax, air] = hitungRekomendasiNutrisi(kaloriHarian);
  
    // Kembalikan semua hasil dalam bentuk objek
    return {
      bmr,
      kaloriHarian,
      proteinMin,
      proteinMax,
      lemakMin,
      lemakMax,
      karbohidratMin,
      karbohidratMax,
      air,
    };
  };

  module.exports = hitungSemuaNutrisi;