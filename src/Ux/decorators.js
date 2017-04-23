import { UserInterfaceManager } from 'UserInterfaceManager';

export const injectData = (neededData) => (target) => {
    target[UserInterfaceManager.injectDataSymbol()] = neededData;
};

export const useRender = (render) => (target) => {
    target[UserInterfaceManager.useRenderSymbol()] = render;
};
