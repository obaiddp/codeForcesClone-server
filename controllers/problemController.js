const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllProblems = async (req, res) => {
    try {
        const problems = await prisma.problem.findMany({
            include: {
                solutions: true,
                examples: true
            }
        });
        res.json(problems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getProblemById = async (req, res) => {
    try {
        const problem = await prisma.problem.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                solutions: true,
                examples: true
            }
        });
        
        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }
        
        res.json(problem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.addProblem = async (req, res) => {
    try {
        const { solutions, examples, ...problemData } = req.body;
        
        const problem = await prisma.problem.create({
            data: {
                ...problemData,
                solutions: {
                    create: solutions || []
                },
                examples: {
                    create: examples || []
                }
            },
            include: {
                solutions: true,
                examples: true
            }
        });

        res.json(problem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};