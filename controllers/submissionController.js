const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

exports.createSubmission = async (req, res) => {
    try {
        const { language, version, code, problemId } = req.body;

        // Get the problem and its examples
        const problem = await prisma.problem.findUnique({
            where: { id: parseInt(problemId) },
            include: { examples: true }
        });

        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        const testcases = problem.examples;
        let allPassed = true;
        let results = [];

        for (const tc of testcases) {
            console.log("Testcase input: ", tc.input);
            console.log("Testcase output: ", tc.output);

            try {
                // Send code to Piston API for each test case
                const apiRes = await axios.post('http://localhost:2000/api/v2/execute', {
                    language,
                    version,
                    files: [
                        {
                            name: language === "java" ? "Main.java" : 
                                  language === "python" ? "main.py" : "main.js",
                            content: code,
                        },
                    ],
                    stdin: String(tc.input),
                });

                const run = apiRes.data.run;
                const output = (run.stdout || "").trim();
                const expected = (tc.output || "").trim();

                console.log("======================================");
                console.log("output from piston: ", output);
                console.log("expected: ", expected);

                const passed = output === expected;
                if (!passed) allPassed = false;

                results.push({
                    input: tc.input,
                    expected,
                    output,
                    passed,
                    executionTime: run.cpu_time,
                });

            } catch (error) {
                allPassed = false;
                results.push({
                    input: tc.input,
                    error: error.message,
                    passed: false
                });
            }
        }

        // Determine final status
        const status = allPassed ? "accepted" : "rejected";
        console.log(allPassed);
        console.log(results);

        // Store submission
        const newSubmission = await prisma.submission.create({
            data: {
                language,
                version,
                code,
                note: "",
                status,
                executionTime: results.reduce((sum, r) => sum + (r.executionTime || 0), 0),
                results,
                problemId: parseInt(problemId),
                userId: req.user.id
            }
        });

        res.json({ newSubmission });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSubmission = async (req, res) => {
    try {
        const submissions = await prisma.submission.findMany({
            include: {
                problem: {
                    select: {
                        id: true,
                        name: true,
                        difficulty: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getSubmissionById = async (req, res) => {
    try {
        const submission = await prisma.submission.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                problem: {
                    select: {
                        id: true,
                        name: true,
                        difficulty: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        
        if (!submission) {
            return res.status(404).json({ error: 'Submission not found' });
        }
        
        res.json(submission);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateSubmission = async (req, res) => {
    try {
        const { note } = req.body;

        const submission = await prisma.submission.update({
            where: { id: parseInt(req.params.id) },
            data: { note }
        });

        res.json({ message: "Updated", submission });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}