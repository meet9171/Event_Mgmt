export interface BadgeRenderConfig {
    containerWidth: number;
    containerHeight: number;
    templateWidth: number;
    templateHeight: number;
  }
  
  export function calculateElementPosition(
    element: BadgeTemplateElement, 
    config: BadgeRenderConfig
  ) {
    const scaleX = config.containerWidth / config.templateWidth;
    const scaleY = config.containerHeight / config.templateHeight;
    const scale = Math.min(scaleX, scaleY);
  
    const offsetX = (config.containerWidth - (config.templateWidth * scale)) / 2;
    const offsetY = (config.containerHeight - (config.templateHeight * scale)) / 2;
  
    return {
      x: (element.x * scale) + offsetX,
      y: (element.y * scale) + offsetY,
      width: element.width * scale,
      height: element.height * scale,
      fontSize: (element.fontSize || 16) * scale,
      scale
    };
  }
  
  export function resolveElementContent(
    element: BadgeTemplateElement, 
    userData: UserBadgeData
  ): string {
    // Similar content resolution logic as in UserBadge
    const formFieldResponse = userData.DATA.otherField.find(
      response => response.form_fields?.label?.toLowerCase() === element.content.toLowerCase()
    );
  
    switch (element.type) {
      case 'text':
      case 'number':
      case 'select':
        if (element.content?.toLowerCase() === 'username') {
          return userData?.DATA?.name ||
            formFieldResponse?.response_value ||
            element.content ||
            'N/A';
        }
        return formFieldResponse
          ? formFieldResponse.response_value
          : (userData[element.content.toUpperCase()] as string) || element.content;
      
      case 'email':
        return userData['EMAIL'] as string || element.content;
      
      default:
        return element.content;
    }
  }

  export function prepareCanvasElements(
    badgeTemplate: any, 
    userData: UserBadgeData
  ): any[] {
    if (!badgeTemplate || !userData) return [];
  
    return badgeTemplate.elements.map(element => {
      const preparedElement = { ...element };
  
      // Resolve content
      preparedElement.content = resolveElementContent(element, userData);
  
      // Prepare image if needed
      if (element.type === 'image') {
        const img = new Image();
        img.src = element.content;
        preparedElement.imageObj = img;
      }
  
      return preparedElement;
    });
  }