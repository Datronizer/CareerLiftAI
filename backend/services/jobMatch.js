const { BigQuery } = require('@google-cloud/bigquery');

class JobMatchService {
  constructor({ projectId, dataset, table, credentials }) {
    this.projectId = projectId;
    this.dataset = dataset;
    this.table = table;
    this.enabled = !!(projectId && dataset && table);
    this.client = this.enabled
      ? new BigQuery({
          projectId,
          credentials
        })
      : null;
  }

  isEnabled() {
    return this.enabled;
  }

  async findJobs({ skills = [], location = '', jobTitle = '' }, limit = 10) {
    if (!this.enabled) {
      throw new Error('Job match service not configured.');
    }

    const skillPatterns = (skills || [])
      .map((s) => s?.trim())
      .filter(Boolean)
      .map((s) => s.toLowerCase());

    const locationPattern = (location || '').toLowerCase();
    const titlePattern = (jobTitle || '').toLowerCase();

    const filters = [];
    const params = {};

    if (skillPatterns.length) {
      filters.push(`(${skillPatterns.map((_, idx) => `REGEXP_CONTAINS(LOWER(skills), @skill${idx})`).join(' OR ')})`);
      skillPatterns.forEach((s, idx) => (params[`skill${idx}`] = s));
    }

    if (locationPattern) {
      filters.push(`REGEXP_CONTAINS(LOWER(location), @loc)`);
      params.loc = locationPattern;
    }

    if (titlePattern) {
      filters.push(`REGEXP_CONTAINS(LOWER(job_title), @title)`);
      params.title = titlePattern;
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const query = `
      SELECT
        job_title,
        company,
        location,
        skills,
        salary_range,
        qualifications,
        work_type
      FROM \`${this.projectId}.${this.dataset}.${this.table}\`
      ${whereClause}
      LIMIT @limit
    `;

    const [rows] = await this.client.query({
      query,
      params: { ...params, limit }
    });

    return rows || [];
  }
}

module.exports = JobMatchService;
