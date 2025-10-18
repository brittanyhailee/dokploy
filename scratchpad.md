# Research Notes: Basic Authentication Password Security Issue

## 🎯 **The Problem**
The basic authentication password is displayed in **plain text** in the Advanced > Security view, which is a security concern. The issue is in the `show-security.tsx` component at **line 72**:

```tsx
{security.password}
```

## 🏗️ **System Architecture Overview**

### **1. UI Layer (Frontend)**
- **Location**: `apps/dokploy/components/dashboard/application/advanced/security/`
- **Main Components**:
  - `show-security.tsx` - Displays the security list (where the bug is)
  - `handle-security.tsx` - Handles create/edit forms
- **Navigation**: Application → Advanced tab → Security section
- **Route**: `/dashboard/project/[projectId]/services/application/[applicationId]` → Advanced tab

### **2. Data Flow**
```
UI Component → tRPC API → Server Service → Database
     ↓              ↓           ↓            ↓
show-security → security.one → findSecurityById → security table
```

### **3. API Layer (tRPC)**
- **Router**: `apps/dokploy/server/api/routers/security.ts`
- **Endpoints**:
  - `security.create` - Creates new basic auth
  - `security.one` - Gets single security record
  - `security.update` - Updates security
  - `security.delete` - Deletes security
- **Authorization**: Checks organization access before operations

### **4. Service Layer**
- **Location**: `packages/server/src/services/security.ts`
- **Functions**:
  - `createSecurity()` - Creates security record
  - `findSecurityById()` - Retrieves security by ID
  - `updateSecurityById()` - Updates security
  - `deleteSecurityById()` - Deletes security

### **5. Database Layer**
- **Schema**: `packages/server/src/db/schema/security.ts`
- **Table**: `security` with fields: `securityId`, `username`, `password`, `applicationId`
- **Relations**: Many-to-one with `applications` table

## 🔍 **How Similar Features Work (Consistent Pattern)**

All other password fields in the application use the `ToggleVisibilityInput` component:

### **Examples of Proper Implementation**:

1. **MySQL Credentials** (`show-internal-mysql-credentials.tsx`):
```tsx
<ToggleVisibilityInput
    disabled
    value={data?.databasePassword}
/>
```

2. **PostgreSQL Credentials** (`show-internal-postgres-credentials.tsx`):
```tsx
<ToggleVisibilityInput
    value={data?.databasePassword}
    disabled
/>
```

3. **MongoDB Credentials** (`show-internal-mongo-credentials.tsx`):
```tsx
<ToggleVisibilityInput
    disabled
    value={data?.databasePassword}
/>
```

### **ToggleVisibilityInput Component Features**:
- **Location**: `apps/dokploy/components/shared/toggle-visibility-input.tsx`
- **Features**:
  - Password hidden by default (dots/asterisks)
  - Eye icon to toggle visibility
  - Copy to clipboard functionality
  - Consistent styling with other password fields

## 🎯 **The Fix Required**

The solution is straightforward and follows the existing pattern:

**Replace this** (in `show-security.tsx` line 69-74):
```tsx
<div className="flex flex-col gap-1">
    <span className="font-medium">Password</span>
    <span className="text-sm text-muted-foreground">
        {security.password}
    </span>
</div>
```

**With this**:
```tsx
<div className="flex flex-col gap-1">
    <span className="font-medium">Password</span>
    <ToggleVisibilityInput
        disabled
        value={security.password}
    />
</div>
```

## 📋 **Files That Need Changes**

1. **Primary Fix**: `apps/dokploy/components/dashboard/application/advanced/security/show-security.tsx`
   - Replace plain text display with `ToggleVisibilityInput`
   - Add import for `ToggleVisibilityInput`

2. **Optional Enhancement**: `apps/dokploy/components/dashboard/application/advanced/security/handle-security.tsx`
   - The form already uses regular `Input` components, which is fine for editing
   - Could be enhanced to use `ToggleVisibilityInput` for consistency

## 🔄 **Event Handling & State Management**

- **Form Handling**: Uses `react-hook-form` with Zod validation
- **State Management**: tRPC for server state, React state for UI
- **Mutations**: Create/Update/Delete operations with optimistic updates
- **Cache Invalidation**: Updates application cache after security changes

## 🛡️ **Security Considerations**

- **Backend**: Passwords are hashed with bcrypt before storage
- **Frontend**: Currently displays plain text (the bug)
- **Authorization**: Proper organization-level access control
- **API**: All endpoints are protected and validate permissions

## 📝 **Implementation Steps**

1. Import `ToggleVisibilityInput` in `show-security.tsx`
2. Replace the plain text password display with `ToggleVisibilityInput` component
3. Test the functionality to ensure password is hidden by default
4. Verify toggle visibility and copy functionality work correctly
5. Ensure consistent styling with other password fields in the app

This architecture is well-structured and follows React/Next.js best practices with tRPC for type-safe API calls. The fix will be simple and consistent with the existing codebase patterns.
