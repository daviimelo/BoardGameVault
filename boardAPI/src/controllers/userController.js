import { userService } from '../services/userService.js';
import { errorMessages } from '../helpers/validators.js';

export const getMe = async (req, res) => {
    try {
        const userId = req.user.id; 

        const user = await userService.findById(userId);
        if (!user) {
            return res.status(404).json({ message: errorMessages.USER_NOT_FOUND });
        }

        return res.status(200).json({
            message: "Usuário encontrado!",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.error("Erro no getMe:", error);
        return res.status(500).json({
            message: "Erro ao obter dados do usuário.",
            error: error.message
        });
    }
};