'use client';

import { Mail, User, FileText } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import type { Vendor } from '../types';

interface VendorCardProps {
  vendor: Vendor;
}

export function VendorCard({ vendor }: VendorCardProps) {
  const fullName = `${vendor.firstName} ${vendor.lastName}`;
  const initials = `${vendor.firstName[0]}${vendor.lastName[0]}`.toUpperCase();

  return (
    <Card className="group h-full transition-all hover:shadow-lg hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex flex-col items-center gap-3">
          {/* Avatar */}
          <Avatar className="h-24 w-24 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
            <AvatarImage src={vendor.photo || undefined} alt={fullName} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Nombre completo */}
          <div className="text-center">
            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
              {fullName}
            </h3>
            <Badge variant="outline" className="mt-2">
              Vendedor
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Email */}
        <div className="flex items-start gap-3 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-muted-foreground text-xs mb-1">Correo electrónico</p>
            <p className="font-medium truncate">{vendor.email}</p>
          </div>
        </div>

        {/* Documento */}
        <div className="flex items-start gap-3 text-sm">
          <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-muted-foreground text-xs mb-1">Documento</p>
            <p className="font-medium">{vendor.document}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
