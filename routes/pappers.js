const express = require("express");
const axios = require("axios");
const { sendToWebhook } = require("../utils/webhook");
const API_TOKEN = process.env.API_TOKEN;

const router = express.Router();
const jobs = {};

// Fonction pour obtenir les détails de l'entreprise
async function getCompanyDetailsFromPappers(siren) {
  try {
    const response = await axios.get(
      `https://api.pappers.fr/v2/entreprise?api_token=${API_TOKEN}&siren=${siren}`
    );
    return response;
  } catch (error) {
    console.error("Error in getCompanyDetailsFromPappers:", error);
    throw error;
  }
}

// Fonction pour obtenir les détails des dirigeants
async function getDirectorsDetailsFromPappers(siren) {
  try {
    const response = await axios.get(
      `https://api.pappers.fr/v2/recherche-dirigeants?api_token=${API_TOKEN}&siren=${siren}`
    );
    return response;
  } catch (error) {
    console.error("Error in getDirectorsDetailsFromPappers:", error);
    throw error;
  }
}

// Route pour obtenir les détails d'une entreprise
router.get("/entreprise", async (req, res) => {
  const siren = req.query.siren;

  if (!siren) {
    return res.status(400).send("Siren number is required");
  }

  const jobId = "job_" + Date.now();
  jobs[jobId] = { status: "In progress", data: null };

  try {
    const companyResponse = await getCompanyDetailsFromPappers(siren);
    const directorsResponse = await getDirectorsDetailsFromPappers(siren);

    const companyDetails = companyResponse.data;
    const directorsDetails = directorsResponse.data;

    jobs[jobId] = {
      status: "Completed",
      data: { companyDetails, directorsDetails },
    };
    sendToWebhook({ companyDetails, directorsDetails });

    res.send({ jobId, message: "Company details fetching started" });
  } catch (error) {
    console.error("Error occurred:", error.message);
    jobs[jobId] = { status: "Failed", data: null };
    res.status(500).send("Error fetching company details");
  }
});

// Route pour obtenir les détails d'un job
router.get("/jobs", (req, res) => {
  const jobId = req.query.jobId;
  const job = jobs[jobId];

  if (job) {
    res.json(job);
  } else {
    res.status(404).send("Job not found");
  }
});

module.exports = router;
