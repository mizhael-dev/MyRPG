def calculate_derived_attributes(attributes):
    """
    Calculate derived attributes for a character based on their core attributes.
    
    Args:
        attributes (dict): A dictionary containing the core attributes, e.g.,
                           {'Constitution': 10, 'Magic': 10, 'Willpower': 20}
    
    Returns:
        dict: A dictionary with calculated derived attributes including max and current values.
    """
    derived_attributes = {
        "Max HP": attributes["Constitution"],  # Hit Points derived from Constitution
        "HP": attributes["Constitution"],     # Current HP initially matches Max HP
        
        "Max Stamina": attributes["Constitution"] * 2,  # Stamina derived from Constitution
        "Stamina": attributes["Constitution"] * 2,      # Current Stamina initially matches Max Stamina
        
        "Max MP": attributes["Magic"] * 2,  # Magic Points derived from Magic attribute
        "MP": attributes["Magic"] * 2,     # Current MP initially matches Max MP
        
        "Max Focus": attributes["Willpower"],  # Focus derived from Willpower
        "Focus": attributes["Willpower"],      # Current Focus initially matches Max Focus
        
        "Max Daily Fatigue": attributes["Willpower"] * 5,  # Daily Fatigue derived from Willpower
        "Daily Fatigue": attributes["Willpower"] * 5       # Current Daily Fatigue initially matches Max Daily Fatigue
    }
    return derived_attributes

# Example attributes for testing
attributes = {
    "Constitution": 10,
    "Magic": 10,
    "Willpower": 20
}

# Calculate the derived attributes based on attributes
derived_attributes = calculate_derived_attributes(attributes)
derived_attributes
