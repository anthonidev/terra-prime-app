'use client';

import { Mail, FileText } from 'lucide-react';

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
    <Card className="group h-full transition-all hover:scale-[1.02] hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex flex-col items-center gap-3">
          {/* Avatar */}
          <Avatar className="ring-primary/10 group-hover:ring-primary/30 h-24 w-24 ring-2 transition-all">
            <AvatarImage src={vendor.photo || undefined} alt={fullName} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Nombre completo */}
          <div className="text-center">
            <h3 className="group-hover:text-primary text-xl font-bold transition-colors">
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
          <Mail className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground mb-1 text-xs">Correo electrónico</p>
            <p className="truncate font-medium">{vendor.email}</p>
          </div>
        </div>

        {/* Documento */}
        <div className="flex items-start gap-3 text-sm">
          <FileText className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground mb-1 text-xs">Documento</p>
            <p className="font-medium">{vendor.document}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
